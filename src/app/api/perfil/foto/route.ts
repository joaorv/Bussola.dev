import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ratelimitPerfil } from "@/lib/rate-limit";
import { detectarTipoImagem, fotoUrl } from "@/lib/perfil";
import { FOTO_MAX_BYTES } from "@/lib/perfil-validation";

const naoAutenticado = () =>
  NextResponse.json({ error: "Entre na sua conta para continuar." }, { status: 401 });

const contaNaoEncontrada = () =>
  NextResponse.json({ error: "Conta não encontrada." }, { status: 404 });

function contaSumiu(error: unknown) {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025"
  );
}

// GET /api/perfil/foto: devolve a imagem do usuário logado.
export async function GET(request: Request) {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return naoAutenticado();

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { foto: true, fotoTipo: true },
  });

  if (!user?.foto || !user.fotoTipo) {
    return NextResponse.json({ error: "Sem foto." }, { status: 404 });
  }

  // Com ?v= (a URL que a aplicação gera) o conteúdo daquela URL nunca muda:
  // pode ficar em cache. Sem ele, o navegador sempre confere de novo.
  const versionada = new URL(request.url).searchParams.has("v");

  return new Response(new Uint8Array(user.foto), {
    headers: {
      "Content-Type": user.fotoTipo,
      "Content-Length": String(user.foto.byteLength),
      // "private": é a foto de quem está logado, não pode ficar em cache de CDN.
      "Cache-Control": versionada
        ? "private, max-age=31536000, immutable"
        : "private, no-cache",
      "X-Content-Type-Options": "nosniff",
      "Content-Security-Policy": "default-src 'none'",
    },
  });
}

// PUT /api/perfil/foto: envia ou troca a foto (multipart, campo "foto").
export async function PUT(request: Request) {
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

  const muitoGrande = () =>
    NextResponse.json(
      { error: `A foto pode ter no máximo ${FOTO_MAX_BYTES / 1024 / 1024} MB.` },
      { status: 413 }
    );

  // Recusa antes de ler o corpo quando o próprio cliente já avisa o tamanho.
  // A folga cobre os cabeçalhos do multipart.
  const tamanhoDeclarado = Number(request.headers.get("content-length") ?? 0);
  if (tamanhoDeclarado > FOTO_MAX_BYTES + 16 * 1024) return muitoGrande();

  let arquivo: FormDataEntryValue | null;
  try {
    arquivo = (await request.formData()).get("foto");
  } catch {
    return NextResponse.json({ error: "Envie a foto no campo \"foto\"." }, { status: 400 });
  }

  if (!(arquivo instanceof File) || arquivo.size === 0) {
    return NextResponse.json({ error: "Envie a foto no campo \"foto\"." }, { status: 400 });
  }

  if (arquivo.size > FOTO_MAX_BYTES) return muitoGrande();

  const bytes = new Uint8Array(await arquivo.arrayBuffer());
  const tipo = detectarTipoImagem(bytes);

  if (!tipo) {
    return NextResponse.json(
      { error: "Formato não suportado. Use JPG, PNG ou WebP." },
      { status: 415 }
    );
  }

  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { foto: bytes, fotoTipo: tipo, fotoAtualizadaEm: new Date() },
      select: { fotoAtualizadaEm: true },
    });

    return NextResponse.json({ fotoUrl: fotoUrl(user.fotoAtualizadaEm) });
  } catch (error) {
    if (contaSumiu(error)) return contaNaoEncontrada();

    console.error("Erro ao salvar foto do perfil:", error);
    return NextResponse.json(
      { error: "Não foi possível salvar a foto. Tente novamente." },
      { status: 500 }
    );
  }
}

// DELETE /api/perfil/foto: remove a foto (o perfil volta a mostrar as iniciais).
export async function DELETE() {
  const session = await getSession();
  const userId = session?.user?.id;
  if (!userId) return naoAutenticado();

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { foto: null, fotoTipo: null, fotoAtualizadaEm: null },
      select: { id: true },
    });
  } catch (error) {
    if (contaSumiu(error)) return contaNaoEncontrada();

    console.error("Erro ao remover foto do perfil:", error);
    return NextResponse.json(
      { error: "Não foi possível remover a foto. Tente novamente." },
      { status: 500 }
    );
  }

  return new Response(null, { status: 204 });
}
