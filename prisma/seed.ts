// Popula as tabelas de roadmap a partir de src/data/roadmaps.json.
//
// Idempotente: usa os slugs do JSON como id, então rodar de novo atualiza o
// que mudou em vez de duplicar. Etapas e tópicos que saíram do JSON são
// removidos do banco, para o banco sempre refletir o arquivo.
//
// Uso: npx prisma db seed   (com DATABASE_URL apontando para o banco desejado)

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, NivelTopico } from "../src/generated/prisma/client";

type RoadmapJson = {
  id: string;
  title: string;
  description: string;
  categories: {
    id: string;
    name: string;
    order: number;
    topics: {
      id: string;
      title: string;
      description: string;
      level: "required" | "recommended" | "optional";
      resources: { type: "concept" | "tool" | "framework"; name: string }[];
    }[];
  }[];
};

const NIVEIS: Record<RoadmapJson["categories"][number]["topics"][number]["level"], NivelTopico> = {
  required: NivelTopico.essencial,
  recommended: NivelTopico.recomendado,
  optional: NivelTopico.opcional,
};

const TIPOS_RECURSO = {
  concept: "conceito",
  tool: "ferramenta",
  framework: "framework",
} as const;

const connectionString = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("Defina DATABASE_URL (ou DATABASE_URL_UNPOOLED) para rodar o seed.");
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const arquivo = join(__dirname, "..", "src", "data", "roadmaps.json");
  const { roadmaps } = JSON.parse(readFileSync(arquivo, "utf-8")) as { roadmaps: RoadmapJson[] };

  for (const roadmap of roadmaps) {
    const etapaIds = roadmap.categories.map((c) => c.id);

    await prisma.$transaction(async (tx) => {
      await tx.roadmap.upsert({
        where: { id: roadmap.id },
        create: { id: roadmap.id, titulo: roadmap.title, descricao: roadmap.description },
        update: { titulo: roadmap.title, descricao: roadmap.description },
      });

      // Remove as etapas que saíram do JSON (os tópicos delas vão junto, em cascata).
      await tx.etapa.deleteMany({ where: { roadmapId: roadmap.id, id: { notIn: etapaIds } } });

      for (const categoria of roadmap.categories) {
        const etapa = { roadmapId: roadmap.id, nome: categoria.name, ordem: categoria.order };
        await tx.etapa.upsert({
          where: { id: categoria.id },
          create: { id: categoria.id, ...etapa },
          update: etapa,
        });

        await tx.topico.deleteMany({
          where: { etapaId: categoria.id, id: { notIn: categoria.topics.map((t) => t.id) } },
        });

        for (const [indice, topico] of categoria.topics.entries()) {
          const dados = {
            etapaId: categoria.id,
            titulo: topico.title,
            descricao: topico.description,
            nivel: NIVEIS[topico.level],
            ordem: indice + 1,
            recursos: topico.resources.map((r) => ({ tipo: TIPOS_RECURSO[r.type], nome: r.name })),
          };
          await tx.topico.upsert({
            where: { id: topico.id },
            create: { id: topico.id, ...dados },
            update: dados,
          });
        }
      }
    }, { timeout: 60_000 });

    const topicos = roadmap.categories.reduce((total, c) => total + c.topics.length, 0);
    console.log(`✓ ${roadmap.id}: ${roadmap.categories.length} etapas, ${topicos} tópicos`);
  }

  // Remove roadmaps que saíram do JSON.
  const { count } = await prisma.roadmap.deleteMany({
    where: { id: { notIn: roadmaps.map((r) => r.id) } },
  });
  if (count > 0) console.log(`✓ ${count} roadmap(s) removido(s)`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
