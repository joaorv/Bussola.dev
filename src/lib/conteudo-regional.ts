import type { Modalidade, TipoConteudoRegional } from "@/generated/prisma/client";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { normalizarCidade } from "@/lib/regioes";

export const TIPO_LABELS: Record<TipoConteudoRegional, string> = {
  curso: "Curso",
  empresa: "Empresa",
  evento: "Evento",
  comunidade: "Comunidade",
};

export const MODALIDADE_LABELS: Record<Modalidade, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Híbrido",
};

export const TIPOS = Object.keys(TIPO_LABELS) as TipoConteudoRegional[];

// Quão perto o item está da pessoa: na cidade dela, no estado dela (estado
// todo ou outra cidade da UF) ou nacional (online / sem região).
export type Alcance = "cidade" | "estado" | "nacional";

export type ConteudoPertoDeVoce = {
  id: string;
  tipo: TipoConteudoRegional;
  titulo: string;
  descricao: string;
  url: string | null;
  modalidade: Modalidade;
  estado: string | null;
  cidade: string | null;
  gratuito: boolean | null;
  inicioEm: Date | null;
  fimEm: Date | null;
  alcance: Alcance;
};

export type FiltroConteudoRegional = {
  estado: string | null;
  cidade: string | null;
  roadmapId?: string;
  tipo?: TipoConteudoRegional;
  limite?: number;
};

const ORDEM_ALCANCE = { cidade: 0, estado: 1, nacional: 2 } as const;

// Conteúdo regional ativo para a pessoa: o da cidade dela primeiro, depois o
// do estado e por fim o nacional. Sem estado, só o nacional. Com `roadmapId`,
// só o que é dessa trilha ou serve para qualquer trilha. Eventos que já
// terminaram ficam de fora.
export async function buscarConteudoRegional({
  estado,
  cidade,
  roadmapId,
  tipo,
  limite = 12,
}: FiltroConteudoRegional): Promise<ConteudoPertoDeVoce[]> {
  const filtros: Prisma.ConteudoRegionalWhereInput[] = [
    { OR: [{ fimEm: null }, { fimEm: { gte: new Date() } }] },
    { OR: estado ? [{ estado: null }, { estado }] : [{ estado: null }] },
  ];
  if (roadmapId) {
    filtros.push({ OR: [{ roadmaps: { some: { id: roadmapId } } }, { roadmaps: { none: {} } }] });
  }
  if (tipo) filtros.push({ tipo });

  const itens = await prisma.conteudoRegional.findMany({
    where: { ativo: true, AND: filtros },
    select: {
      id: true,
      tipo: true,
      titulo: true,
      descricao: true,
      url: true,
      modalidade: true,
      estado: true,
      cidade: true,
      gratuito: true,
      inicioEm: true,
      fimEm: true,
    },
  });

  // A comparação de cidade é feita aqui, sem acento nem caixa, porque cada um
  // digita de um jeito ("Sao Paulo", "são paulo").
  const minhaCidade = cidade ? normalizarCidade(cidade) : null;
  const alcanceDe = (item: (typeof itens)[number]): Alcance => {
    if (!item.estado) return "nacional";
    if (item.cidade && minhaCidade && normalizarCidade(item.cidade) === minhaCidade) {
      return "cidade";
    }
    return "estado";
  };

  // Dentro do estado, o que vale para o estado todo vem antes do que é de
  // outra cidade.
  const ordem = (item: ConteudoPertoDeVoce) =>
    ORDEM_ALCANCE[item.alcance] * 2 + (item.alcance === "estado" && item.cidade ? 1 : 0);

  return itens
    .map((item) => ({ ...item, alcance: alcanceDe(item) }))
    .sort(
      (a, b) =>
        ordem(a) - ordem(b) ||
        (a.inicioEm?.getTime() ?? Infinity) - (b.inicioEm?.getTime() ?? Infinity) ||
        a.titulo.localeCompare(b.titulo, "pt-BR")
    )
    .slice(0, limite);
}
