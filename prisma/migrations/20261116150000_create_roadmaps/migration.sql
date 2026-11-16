-- CreateEnum
CREATE TYPE "NivelTopico" AS ENUM ('essencial', 'recomendado', 'opcional');

-- CreateTable
CREATE TABLE "Roadmap" (
    "id" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Etapa" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "Etapa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Topico" (
    "id" TEXT NOT NULL,
    "etapaId" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "nivel" "NivelTopico" NOT NULL,
    "ordem" INTEGER NOT NULL,
    "recursos" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "Topico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Etapa_roadmapId_ordem_idx" ON "Etapa"("roadmapId", "ordem");

-- CreateIndex
CREATE INDEX "Topico_etapaId_ordem_idx" ON "Topico"("etapaId", "ordem");

-- AddForeignKey
ALTER TABLE "Etapa" ADD CONSTRAINT "Etapa_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Topico" ADD CONSTRAINT "Topico_etapaId_fkey" FOREIGN KEY ("etapaId") REFERENCES "Etapa"("id") ON DELETE CASCADE ON UPDATE CASCADE;

