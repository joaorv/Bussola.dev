"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { topicoExiste } from "@/lib/trilha";

export type ResultadoProgresso = { ok: true } | { ok: false; erro: string };

// Marca ou desmarca um tópico da trilha como concluído para o usuário logado.
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

  // Os ids vêm do navegador: só aceita tópicos que existem neste roadmap.
  if (!(await topicoExiste(roadmapId, topicId))) {
    return { ok: false, erro: "Tópico não encontrado." };
  }

  try {
    if (concluido) {
      await prisma.progressoTopico.upsert({
        where: { userId_roadmapId_topicId: { userId, roadmapId, topicId } },
        create: { userId, roadmapId, topicId },
        update: {},
      });
    } else {
      await prisma.progressoTopico.deleteMany({
        where: { userId, roadmapId, topicId },
      });
    }
  } catch (error) {
    console.error("Erro ao salvar progresso:", error);
    return { ok: false, erro: "Não foi possível salvar. Tente novamente." };
  }

  revalidatePath(`/roadmaps/${roadmapId}`);
  revalidatePath("/perfil");

  return { ok: true };
}
