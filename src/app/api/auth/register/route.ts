import { NextResponse } from "next/server";
import { z } from "zod";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { ratelimit } from "@/lib/rate-limit";
import { BCRYPT_COST } from "@/lib/auth";
import { emailSchema, nomeSchema } from "@/lib/lead-validation";
import { senhaSchema } from "@/lib/user-validation";

const registerSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  password: senhaSchema,
  aceiteTermos: z.literal(true),
});

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body?.website) {
      return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
    }

    const resultado = registerSchema.safeParse(body);
    if (!resultado.success) {
      return NextResponse.json(
        { error: "Dados inválidos", erros: resultado.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { nome, email, password } = resultado.data;
    const senhaHash = await hash(password, BCRYPT_COST);

    // Quem passou pela lista de espera já escolheu as áreas de interesse; o
    // perfil aproveita essa escolha em vez de perguntar de novo.
    const lead = await prisma.lead.findUnique({
      where: { email },
      select: { areasInteresse: true },
    });

    const user = await prisma.user.create({
      data: { nome, email, senhaHash, areasInteresse: lead?.areasInteresse ?? [] },
      select: { id: true, nome: true, email: true, createdAt: true },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    console.error("Erro ao registrar usuário:", error);
    return NextResponse.json({ error: "Erro interno ao cadastrar usuário" }, { status: 500 });
  }
}
