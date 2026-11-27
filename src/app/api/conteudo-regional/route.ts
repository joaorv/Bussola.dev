import { NextResponse } from "next/server";
import type { TipoConteudoRegional } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buscarConteudoRegional, TIPOS } from "@/lib/conteudo-regional";
import { CIDADE_MAX } from "@/lib/perfil-validation";
import { ehUF } from "@/lib/regioes";

const LIMITE_MAX = 50;

const erro = (mensagem: string) => NextResponse.json({ error: mensagem }, { status: 400 });

// GET /api/conteudo-regional: cursos, empresas, eventos e comunidades perto da
// pessoa, do mais próximo (cidade) ao mais amplo (nacional).
//
// Parâmetros (todos opcionais):
//   estado, cidade  região a usar; sem `estado`, usa a do perfil de quem está
//                   logado; sem nenhuma das duas, devolve só o nacional
//   roadmapId       só o que serve para essa trilha
//   tipo            curso | empresa | evento | comunidade
//   limite          1 a 50 (padrão 12)
export async function GET(request: Request) {
  const params = new URL(request.url).searchParams;

  const estadoParam = params.get("estado")?.trim().toUpperCase() || null;
  const cidadeParam = params.get("cidade")?.trim() || null;
  const roadmapId = params.get("roadmapId")?.trim() || undefined;
  const tipo = params.get("tipo") || undefined;
  const limite = params.has("limite") ? Number(params.get("limite")) : 12;

  if (estadoParam && !ehUF(estadoParam)) return erro("Estado inválido. Use a sigla da UF, ex.: SP.");
  if (cidadeParam && !estadoParam) return erro("Informe o estado junto com a cidade.");
  if (cidadeParam && cidadeParam.length > CIDADE_MAX) return erro("Cidade muito longa.");
  if (tipo && !TIPOS.includes(tipo as TipoConteudoRegional)) {
    return erro(`Tipo inválido. Use: ${TIPOS.join(", ")}.`);
  }
  if (!Number.isInteger(limite) || limite < 1 || limite > LIMITE_MAX) {
    return erro(`O limite deve ser um número de 1 a ${LIMITE_MAX}.`);
  }

  try {
    let local: { estado: string | null; cidade: string | null } = {
      estado: estadoParam,
      cidade: cidadeParam,
    };

    if (!estadoParam) {
      const userId = (await getSession())?.user?.id;
      if (userId) {
        local =
          (await prisma.user.findUnique({
            where: { id: userId },
            select: { estado: true, cidade: true },
          })) ?? local;
      }
    }

    const conteudos = await buscarConteudoRegional({
      ...local,
      roadmapId,
      tipo: tipo as TipoConteudoRegional | undefined,
      limite,
    });

    return NextResponse.json({ local: local.estado ? local : null, conteudos });
  } catch (error) {
    console.error("Erro ao buscar conteúdo regional:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o conteúdo regional." },
      { status: 500 }
    );
  }
}
