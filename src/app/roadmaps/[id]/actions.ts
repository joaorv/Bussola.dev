"use server";

import { getSession } from "@/lib/auth";
import { salvarProgressoTopico } from "@/lib/trilha";

export type ResultadoProgresso = { ok: true } | { ok: false; erro: string };

// Marca ou desmarca um tópico da trilha como concluído para o usuário logado.
// Mesma regra da API /api/roadmaps/[id]/topicos/[topicId]/progresso.
export async function marcarTopico(
  roadmapId: string,
  topicId: string,
  concluido: boolean
): Promise<ResultadoProgresso> {
  const session = await getSession();
  const userId = session?.user?.id;

  if (!userId) {
    return { ok: false, erro: "Entre na sua conta para salvar o progresso." };
  }

  try {
    const salvo = await salvarProgressoTopico(userId, roadmapId, topicId, concluido);
    if (!salvo) return { ok: false, erro: "Tópico não encontrado." };
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
    return { ok: false, erro: "Não foi possível salvar. Tente novamente." };
  }

  return { ok: true };
}
