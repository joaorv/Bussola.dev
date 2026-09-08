import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(leads);
  } catch (error) {
    console.error("Erro ao buscar leads:", error);

    return NextResponse.json(
      { error: "Erro ao buscar leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { nome, email, areaInteresse } = body;

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
