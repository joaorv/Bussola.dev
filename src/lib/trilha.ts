import { revalidatePath } from "next/cache";
import { cache } from "react";
import { prisma } from "@/lib/prisma";
import {
  getRoadmap,
  type ResourceType,
  type Roadmap as RoadmapJson,
  type TopicLevel,
} from "@/lib/roadmaps";

// Conteúdo e progresso de uma trilha, no formato da API
// GET /api/roadmaps/[id]/etapas. A rota e a página /roadmaps/[id] usam estas
// funções, então as duas mostram sempre os mesmos dados.

export type NivelTopico = "essencial" | "recomendado" | "opcional";
export type TipoRecurso = "conceito" | "ferramenta" | "framework";

export type RecursoTrilha = { tipo: TipoRecurso; nome: string };

export type TopicoTrilha = {
  id: string;
  titulo: string;
  descricao: string;
  nivel: NivelTopico;
  ordem: number;
  recursos: RecursoTrilha[];
  concluido: boolean;
  concluidoEm: Date | null;
};

export type EtapaTrilha = {
  id: string;
  nome: string;
  ordem: number;
  totalTopicos: number;
  topicosConcluidos: number;
  concluida: boolean;
  topicos: TopicoTrilha[];
};

export type Trilha = {
  roadmapId: string;
  titulo: string;
  descricao: string;
  totalTopicos: number;
  topicosConcluidos: number;
  percentual: number;
  etapas: EtapaTrilha[];
};

// Os componentes de UI (LevelBadge, legendas) usam os níveis do JSON.
export const NIVEL_PARA_LEVEL: Record<NivelTopico, TopicLevel> = {
  essencial: "required",
  recomendado: "recommended",
  opcional: "optional",
};

export const RECURSO_LABELS: Record<TipoRecurso, string> = {
  conceito: "Conceito",
  ferramenta: "Ferramenta",
  framework: "Framework",
};

const LEVEL_PARA_NIVEL: Record<TopicLevel, NivelTopico> = {
  required: "essencial",
  recommended: "recomendado",
  optional: "opcional",
};

const RESOURCE_PARA_TIPO: Record<ResourceType, TipoRecurso> = {
  concept: "conceito",
  tool: "ferramenta",
  framework: "framework",
};

type TopicoFonte = Omit<TopicoTrilha, "concluido" | "concluidoEm">;
type EtapaFonte = { id: string; nome: string; ordem: number; topicos: TopicoFonte[] };
type RoadmapFonte = { id: string; titulo: string; descricao: string; etapas: EtapaFonte[] };

function converterRoadmapJson(roadmap: RoadmapJson): RoadmapFonte {
  return {
    id: roadmap.id,
    titulo: roadmap.title,
    descricao: roadmap.description,
    etapas: roadmap.categories.map((categoria) => ({
      id: categoria.id,
      nome: categoria.name,
      ordem: categoria.order,
      topicos: categoria.topics.map((topico, indice) => ({
        id: topico.id,
        titulo: topico.title,
        descricao: topico.description,
        nivel: LEVEL_PARA_NIVEL[topico.level],
        ordem: indice + 1,
        recursos: topico.resources.map((recurso) => ({
          tipo: RESOURCE_PARA_TIPO[recurso.type],
          nome: recurso.name,
        })),
      })),
    })),
  };
}

// `recursos` é uma coluna Json: descarta o que não tiver o formato esperado.
function lerRecursos(valor: unknown): RecursoTrilha[] {
  if (!Array.isArray(valor)) return [];

  return valor.flatMap((item) => {
    const { tipo, nome } = (item ?? {}) as Record<string, unknown>;
    return typeof nome === "string" && typeof tipo === "string" && tipo in RECURSO_LABELS
      ? [{ tipo: tipo as TipoRecurso, nome }]
      : [];
  });
}

// Conteúdo da trilha (sem progresso). Lê do banco e cai para
// src/data/roadmaps.json se o seed ainda não rodou. `cache` evita consultar
// o banco duas vezes no mesmo render (metadata + página).
export const buscarRoadmap = cache(async (id: string): Promise<RoadmapFonte | null> => {
  const roadmapDb = await prisma.roadmap.findUnique({
    where: { id },
    select: {
      id: true,
      titulo: true,
      descricao: true,
      etapas: {
        orderBy: { ordem: "asc" },
        select: {
          id: true,
          nome: true,
          ordem: true,
          topicos: {
            orderBy: { ordem: "asc" },
            select: {
              id: true,
              titulo: true,
              descricao: true,
              nivel: true,
              ordem: true,
              recursos: true,
            },
          },
        },
      },
    },
  });

  if (roadmapDb) {
    return {
      ...roadmapDb,
      etapas: roadmapDb.etapas.map((etapa) => ({
        ...etapa,
        topicos: etapa.topicos.map((topico) => ({
          ...topico,
          recursos: lerRecursos(topico.recursos),
        })),
      })),
    };
  }

  const roadmapJson = getRoadmap(id);
  return roadmapJson ? converterRoadmapJson(roadmapJson) : null;
});

// Etapas ordenadas do roadmap, com os tópicos e o status de conclusão do
// usuário (todos pendentes quando `userId` é null).
export async function carregarTrilha(id: string, userId: string | null): Promise<Trilha | null> {
  const roadmap = await buscarRoadmap(id);
  if (!roadmap) return null;

  const concluidos = userId
    ? await prisma.progressoTopico.findMany({
        where: { userId, roadmapId: roadmap.id },
        select: { topicId: true, concluidoEm: true },
      })
    : [];

  const concluidosPorTopico = new Map(concluidos.map((c) => [c.topicId, c.concluidoEm]));

  let totalTopicos = 0;
  let totalConcluidos = 0;

  const etapas = roadmap.etapas.map((etapa) => {
    let topicosConcluidos = 0;

    const topicos = etapa.topicos.map((topico) => {
      const concluidoEm = concluidosPorTopico.get(topico.id) ?? null;
      if (concluidoEm) topicosConcluidos++;
      return { ...topico, concluido: concluidoEm !== null, concluidoEm };
    });

    totalTopicos += topicos.length;
    totalConcluidos += topicosConcluidos;

    return {
      id: etapa.id,
      nome: etapa.nome,
      ordem: etapa.ordem,
      totalTopicos: topicos.length,
      topicosConcluidos,
      concluida: topicos.length > 0 && topicosConcluidos === topicos.length,
      topicos,
    };
  });

  return {
    roadmapId: roadmap.id,
    titulo: roadmap.titulo,
    descricao: roadmap.descricao,
    totalTopicos,
    topicosConcluidos: totalConcluidos,
    percentual: totalTopicos ? Math.round((totalConcluidos / totalTopicos) * 100) : 0,
    etapas,
  };
}

async function topicoExiste(roadmapId: string, topicId: string): Promise<boolean> {
  const roadmap = await buscarRoadmap(roadmapId);
  return !!roadmap?.etapas.some((etapa) => etapa.topicos.some((t) => t.id === topicId));
}

export type ProgressoSalvo = {
  roadmapId: string;
  topicId: string;
  concluido: boolean;
  concluidoEm: Date | null;
};

// Marca (concluido = true) ou desmarca um tópico para o usuário. Usada pela
// API /api/roadmaps/[id]/topicos/[topicId]/progresso e pela Server Action do
// checkbox da trilha. Retorna null se o tópico não pertence ao roadmap (os ids
// vêm do cliente). Marcar de novo mantém a data da primeira conclusão.
export async function salvarProgressoTopico(
  userId: string,
  roadmapId: string,
  topicId: string,
  concluido: boolean
): Promise<ProgressoSalvo | null> {
  if (!(await topicoExiste(roadmapId, topicId))) return null;

  let concluidoEm: Date | null = null;

  if (concluido) {
    const registro = await prisma.progressoTopico.upsert({
      where: { userId_roadmapId_topicId: { userId, roadmapId, topicId } },
      create: { userId, roadmapId, topicId },
      update: {},
      select: { concluidoEm: true },
    });
    concluidoEm = registro.concluidoEm;
  } else {
    await prisma.progressoTopico.deleteMany({ where: { userId, roadmapId, topicId } });
  }

  revalidarProgresso(roadmapId);

  return { roadmapId, topicId, concluido, concluidoEm };
}

// Uma etapa tem poucas dezenas de tópicos; o limite só barra abuso.
const MAX_TOPICOS_POR_VEZ = 200;

// Marca ou desmarca vários tópicos de uma vez (ex.: "concluir etapa"). Retorna
// false, sem gravar nada, se algum id não pertencer ao roadmap.
export async function salvarProgressoTopicos(
  userId: string,
  roadmapId: string,
  topicIds: string[],
  concluido: boolean
): Promise<boolean> {
  const ids = [...new Set(topicIds)];
  if (ids.length === 0 || ids.length > MAX_TOPICOS_POR_VEZ) return false;

  const roadmap = await buscarRoadmap(roadmapId);
  const validos = new Set(roadmap?.etapas.flatMap((e) => e.topicos.map((t) => t.id)));
  if (!ids.every((id) => validos.has(id))) return false;

  if (concluido) {
    // skipDuplicates: quem já estava concluído mantém a data original.
    await prisma.progressoTopico.createMany({
      data: ids.map((topicId) => ({ userId, roadmapId, topicId })),
      skipDuplicates: true,
    });
  } else {
    await prisma.progressoTopico.deleteMany({
      where: { userId, roadmapId, topicId: { in: ids } },
    });
  }

  revalidarProgresso(roadmapId);
  return true;
}

function revalidarProgresso(roadmapId: string) {
  revalidatePath(`/roadmaps/${roadmapId}`);
  revalidatePath("/perfil");
}
