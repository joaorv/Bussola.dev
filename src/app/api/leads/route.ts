import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  return NextResponse.json({ error: "Método não permitido" }, { status: 405 });
}

export async function POST(request: Request) {
  try {
const body = await request.json();

if (
  !body ||
  typeof body !== "object" ||
  Array.isArray(body) ||
  typeof body.nome !== "string" ||
  typeof body.email !== "string" ||
  typeof body.areaInteresse !== "string" ||
  !body.nome.trim() ||
  !body.email.trim() ||
  !body.areaInteresse.trim()
) {
  return NextResponse.json(
    { error: "Dados inválidos" },
    { status: 400 }
  );
}

const nome = body.nome.trim();
const email = body.email.trim();
const areaInteresse = body.areaInteresse.trim();

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
