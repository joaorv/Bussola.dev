"use server";

import { getSession } from "@/lib/auth";
import { salvarProgressoTopicos } from "@/lib/trilha";

export type ResultadoProgresso = { ok: true } | { ok: false; erro: string };

// Marca ou desmarca tópicos da trilha para o usuário logado: um só (checkbox
// do tópico) ou todos de uma etapa ("Marcar etapa como concluída"). Mesma
// regra da API /api/roadmaps/[id]/topicos/[topicId]/progresso.
export async function marcarTopicos(
  roadmapId: string,
  topicIds: string[],
  concluido: boolean
): Promise<ResultadoProgresso> {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, erro: "Entre na sua conta para salvar o progresso." };
  }

  // Os argumentos vêm do navegador: confere o formato antes de usar.
  if (
    typeof roadmapId !== "string" ||
    !Array.isArray(topicIds) ||
    !topicIds.every((id) => typeof id === "string") ||
    typeof concluido !== "boolean"
  ) {
    return { ok: false, erro: "Pedido inválido." };
  }

  try {
    const salvo = await salvarProgressoTopicos(userId, roadmapId, topicIds, concluido);
    if (!salvo) return { ok: false, erro: "Tópico não encontrado." };
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
    return { ok: false, erro: "Não foi possível salvar. Tente novamente." };
  }

  return { ok: true };
}
