import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { salvarProgressoTopico } from "@/lib/trilha";

type Contexto = RouteContext<"/api/roadmaps/[id]/topicos/[topicId]/progresso">;

// POST   /api/roadmaps/[id]/topicos/[topicId]/progresso: marca o tópico como concluído.
// DELETE /api/roadmaps/[id]/topicos/[topicId]/progresso: desmarca o tópico.
// As duas são idempotentes e respondem com o estado final do tópico.
export async function POST(_request: Request, contexto: Contexto) {
  return salvar(contexto, true);
}

export async function DELETE(_request: Request, contexto: Contexto) {
  return salvar(contexto, false);
}

async function salvar(contexto: Contexto, concluido: boolean) {
  const { id, topicId } = await contexto.params;

  try {
    const userId = (await getSession())?.user?.id;

    if (!userId) {
      return NextResponse.json(
        { error: "Entre na sua conta para salvar o progresso." },
        { status: 401 }
      );
    }

    const salvo = await salvarProgressoTopico(userId, id, topicId, concluido);

    if (!salvo) {
      return NextResponse.json(
        { error: "Tópico não encontrado neste roadmap." },
        { status: 404 }
      );
    }

    return NextResponse.json(salvo);
  } catch (error) {
    console.error("Erro ao salvar progresso do tópico:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar o progresso. Tente novamente." },
      { status: 500 }
    );
  }
}
