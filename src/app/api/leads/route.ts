import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { ratelimit } from "@/lib/rate-limit";
import {
  areaInteresseSchema,
  emailSchema,
  nomeSchema,
} from "@/lib/lead-validation";

const leadSchema = z.object({
  nome: nomeSchema,
  email: emailSchema,
  areaInteresse: areaInteresseSchema,
});

export async function GET() {
  return NextResponse.json(
    { error: "Método não permitido" },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0]?.trim() ?? "unknown";

    const { success } = await ratelimit.limit(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Muitas requisições. Tente novamente mais tarde." },
        { status: 429 }
      );
    }

    const body = await request.json();

    if (body?.website) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const resultado = leadSchema.safeParse(body);

    if (!resultado.success) {
      const erros: Record<string, string> = {};

      for (const issue of resultado.error.issues) {
        const campo = issue.path[0];

        if (typeof campo === "string" && !erros[campo]) {
          erros[campo] = issue.message;
        }
      }

      return NextResponse.json(
        {
          error: "Dados inválidos",
          erros,
        },
        { status: 400 }
      );
    }

    const { nome, email, areaInteresse } = resultado.data;

    const leadExistente = await prisma.lead.findUnique({
      where: {
        email,
      },
    });

    if (leadExistente) {
      return NextResponse.json(
        { error: "Este e-mail já está cadastrado." },
        { status: 409 }
      );
    }

    let lead;

    try {
      lead = await prisma.lead.create({
        data: {
          nome,
          email,
          areaInteresse,
        },
      });
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

      throw error;
    }

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lead:", error);

    return NextResponse.json(
      { error: "Erro ao criar lead" },
      { status: 500 }
    );
  }
}