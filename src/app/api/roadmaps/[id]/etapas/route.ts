import { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoadmap, type Roadmap as RoadmapJson } from "@/lib/roadmaps";

const NIVEIS_JSON = {
  required: "essencial",
  recommended: "recomendado",
  optional: "opcional",
} as const;

const TIPOS_RECURSO_JSON = {
  concept: "conceito",
  tool: "ferramenta",
  framework: "framework",
} as const;

type TopicoFonte = {
  id: string;
  titulo: string;
  descricao: string;
  nivel: string;
  ordem: number;
  recursos: Prisma.JsonValue;
};

type EtapaFonte = {
  id: string;
  nome: string;
  ordem: number;
  topicos: TopicoFonte[];
};

type RoadmapFonte = {
  id: string;
  titulo: string;
  descricao: string;
  etapas: EtapaFonte[];
};

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
        nivel: NIVEIS_JSON[topico.level],
        ordem: indice + 1,
        recursos: topico.resources.map((recurso) => ({
          tipo: TIPOS_RECURSO_JSON[recurso.type],
          nome: recurso.name,
        })),
      })),
    })),
  };
}

// GET /api/roadmaps/[id]/etapas: lista as etapas ordenadas de um roadmap,
// com seus tópicos ordenados e o status de conclusão do usuário logado.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await getSession();
    const userId = session?.user?.id ?? null;

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

    // Fallback para src/data/roadmaps.json caso o banco ainda não tenha sido populado com db seed.
    const roadmapJson = roadmapDb ? null : getRoadmap(id);
    const roadmap: RoadmapFonte | null =
      roadmapDb ?? (roadmapJson ? converterRoadmapJson(roadmapJson) : null);

    if (!roadmap) {
      return NextResponse.json(
        { error: "Roadmap não encontrado." },
        { status: 404 }
      );
    }

    const concluidos = userId
      ? await prisma.progressoTopico.findMany({
          where: { userId, roadmapId: roadmap.id },
          select: { topicId: true, concluidoEm: true },
        })
      : [];

    const concluidosPorTopico = new Map(
      concluidos.map((c) => [c.topicId, c.concluidoEm])
    );

    let totalTopicos = 0;
    let totalConcluidos = 0;

    const etapas = roadmap.etapas.map((etapa) => {
      let topicosConcluidos = 0;

      const topicos = etapa.topicos.map((topico) => {
        const concluidoEm = concluidosPorTopico.get(topico.id) ?? null;
        const concluido = concluidoEm !== null;
        if (concluido) topicosConcluidos++;

        return {
          id: topico.id,
          titulo: topico.titulo,
          descricao: topico.descricao,
          nivel: topico.nivel,
          ordem: topico.ordem,
          recursos: topico.recursos,
          concluido,
          concluidoEm,
        };
      });

      const totalEtapa = topicos.length;
      totalTopicos += totalEtapa;
      totalConcluidos += topicosConcluidos;

      return {
        id: etapa.id,
        nome: etapa.nome,
        ordem: etapa.ordem,
        totalTopicos: totalEtapa,
        topicosConcluidos,
        concluida: totalEtapa > 0 && topicosConcluidos === totalEtapa,
        topicos,
      };
    });

    return NextResponse.json({
      roadmapId: roadmap.id,
      titulo: roadmap.titulo,
      descricao: roadmap.descricao,
      totalTopicos,
      topicosConcluidos: totalConcluidos,
      percentual: totalTopicos
        ? Math.round((totalConcluidos / totalTopicos) * 100)
        : 0,
      etapas,
    });
  } catch (error) {
    console.error("Erro ao listar etapas do roadmap:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as etapas do roadmap." },
      { status: 500 }
    );
  }
}
