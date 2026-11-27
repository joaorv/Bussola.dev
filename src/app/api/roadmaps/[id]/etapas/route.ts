import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { carregarTrilha } from "@/lib/trilha";

// GET /api/roadmaps/[id]/etapas: lista as etapas ordenadas de um roadmap,
// com seus tópicos ordenados e o status de conclusão do usuário logado.
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const session = await getSession();
    const trilha = await carregarTrilha(id, session?.user?.id ?? null);

    if (!trilha) {
      return NextResponse.json(
        { error: "Roadmap não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json(trilha);
  } catch (error) {
    console.error("Erro ao listar etapas do roadmap:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar as etapas do roadmap." },
      { status: 500 }
    );
  }
}
