// Popula as tabelas de roadmap a partir de src/data/roadmaps.json e o conteúdo
// regional a partir de src/data/conteudo-regional.json.
//
// Idempotente: usa os slugs do JSON como id, então rodar de novo atualiza o
// que mudou em vez de duplicar. Etapas e tópicos que saíram do JSON são
// removidos do banco, para o banco sempre refletir o arquivo.
//
// Uso: npx prisma db seed   (com DATABASE_URL apontando para o banco desejado)

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  Modalidade,
  NivelTopico,
  PrismaClient,
  TipoConteudoRegional,
} from "../src/generated/prisma/client";
import { ehUF } from "../src/lib/regioes";

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

  await semearConteudoRegional(new Set(roadmaps.map((r) => r.id)));
}

type ConteudoRegionalJson = {
  id: string;
  tipo: TipoConteudoRegional;
  titulo: string;
  descricao: string;
  url: string | null;
  modalidade: Modalidade;
  estado: string | null;
  cidade: string | null;
  gratuito: boolean | null;
  inicioEm?: string | null;
  fimEm?: string | null;
  ativo?: boolean;
  roadmaps: string[];
};

// Cria ou atualiza os itens do JSON (o id do JSON é o id no banco). Itens
// cadastrados por fora do JSON não são tocados; para tirar um item do JSON do
// ar, use "ativo": false em vez de apagá-lo do arquivo.
async function semearConteudoRegional(roadmapIds: Set<string>) {
  const arquivo = join(__dirname, "..", "src", "data", "conteudo-regional.json");
  const { conteudos } = JSON.parse(readFileSync(arquivo, "utf-8")) as {
    conteudos: ConteudoRegionalJson[];
  };

  for (const item of conteudos) {
    if (!(item.tipo in TipoConteudoRegional)) throw new Error(`${item.id}: tipo inválido`);
    if (!(item.modalidade in Modalidade)) throw new Error(`${item.id}: modalidade inválida`);
    if (item.estado !== null && !ehUF(item.estado)) throw new Error(`${item.id}: UF inválida`);
    if (item.cidade && !item.estado) throw new Error(`${item.id}: cidade sem estado`);
    const desconhecido = item.roadmaps.find((id) => !roadmapIds.has(id));
    if (desconhecido) throw new Error(`${item.id}: roadmap "${desconhecido}" não existe`);

    const dados = {
      tipo: item.tipo,
      titulo: item.titulo,
      descricao: item.descricao,
      url: item.url,
      modalidade: item.modalidade,
      estado: item.estado,
      cidade: item.cidade,
      gratuito: item.gratuito,
      inicioEm: item.inicioEm ? new Date(item.inicioEm) : null,
      fimEm: item.fimEm ? new Date(item.fimEm) : null,
      ativo: item.ativo ?? true,
    };
    const roadmaps = item.roadmaps.map((id) => ({ id }));

    await prisma.conteudoRegional.upsert({
      where: { id: item.id },
      create: { id: item.id, ...dados, roadmaps: { connect: roadmaps } },
      update: { ...dados, roadmaps: { set: roadmaps } },
    });
  }

  console.log(`✓ conteúdo regional: ${conteudos.length} itens`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
