import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const areasPredefinidas = [
  "Desenvolvimento Web",
  "Desenvolvimento Mobile",
  "Backend",
  "Frontend",
  "Banco de Dados",
  "DevOps",
  "Dados e IA",
  "Segurança",
] as const;

const leadSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome muito curto")
    .max(100, "Nome muito longo")
    .regex(
      /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u,
      "Nome inválido"
    ),

  email: z
    .string()
    .trim()
    .email("E-mail inválido")
    .max(254, "E-mail muito longo")
    .transform((valor) => valor.toLowerCase()),

  areaInteresse: z
    .string()
    .trim()
    .min(2, "Área de interesse inválida")
    .max(100, "Área de interesse muito longa")
    .refine(
      (valor) =>
        areasPredefinidas.includes(
          valor as (typeof areasPredefinidas)[number]
        ) ||
        /^[\p{L}\p{M}0-9][\p{L}\p{M}0-9 .+#&/'-]*$/u.test(valor),
      "Área de interesse inválida"
    ),
});

export async function GET() {
  return NextResponse.json(
    { error: "Método não permitido" },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body?.website) {
      return NextResponse.json(
        { error: "Dados inválidos" },
        { status: 400 }
      );
    }

    const resultado = leadSchema.safeParse(body);

    if (!resultado.success) {
      return NextResponse.json(
        {
          error: "Dados inválidos",
          detalhes: resultado.error.issues,
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

    const lead = await prisma.lead.create({
      data: {
        nome,
        email,
        areaInteresse,
      },
    });

    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar lead:", error);

    return NextResponse.json(
      { error: "Erro ao criar lead" },
      { status: 500 }
    );
  }
}