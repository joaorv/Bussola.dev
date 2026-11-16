import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ratelimitPerfil } from "@/lib/rate-limit";
import { perfilSelect, serializarPerfil } from "@/lib/perfil";
import { perfilUpdateSchema } from "@/lib/perfil-validation";

const naoAutenticado = () =>
  NextResponse.json({ error: "Entre na sua conta para continuar." }, { status: 401 });

const contaNaoEncontrada = () =>
  NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });

// GET /api/perfil: dados do perfil do usuário logado.
export async function GET() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return naoAutenticado();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: perfilSelect,
  });

  // JWT válido de uma conta que não existe mais no banco.
  if (!user) return contaNaoEncontrada();

  return NextResponse.json(serializarPerfil(user));
}

// PATCH /api/perfil: atualização parcial. Só os campos enviados mudam; mandar
// null ou "" num campo opcional apaga o valor. E-mail e senha não passam por
// aqui (o schema é strict e recusa campos fora da lista).
export async function PATCH(request: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return naoAutenticado();

  const { success } = await ratelimitPerfil.limit(userId);
  if (!success) {
    return NextResponse.json(
      { error: "Muitas alterações seguidas. Aguarde um minuto." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "JSON inválido" }, { status: 400 });
  }

  const resultado = perfilUpdateSchema.safeParse(body);
  if (!resultado.success) {
    const { formErrors, fieldErrors } = resultado.error.flatten();
    return NextResponse.json(
      { error: formErrors[0] ?? "Dados inválidos", erros: fieldErrors },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: resultado.data,
      select: perfilSelect,
    });

    return NextResponse.json(serializarPerfil(user));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return contaNaoEncontrada();
    }

    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar o perfil. Tente novamente." },
      { status: 500 }
    );
  }
}
