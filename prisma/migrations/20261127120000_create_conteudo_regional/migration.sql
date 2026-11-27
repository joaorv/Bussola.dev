-- CreateEnum
CREATE TYPE "TipoConteudoRegional" AS ENUM ('curso', 'empresa', 'evento', 'comunidade');

-- CreateEnum
CREATE TYPE "Modalidade" AS ENUM ('presencial', 'online', 'hibrido');

-- CreateTable
CREATE TABLE "ConteudoRegional" (
    "id" TEXT NOT NULL,
    "tipo" "TipoConteudoRegional" NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "url" TEXT,
    "modalidade" "Modalidade" NOT NULL DEFAULT 'presencial',
    "estado" TEXT,
    "cidade" TEXT,
    "gratuito" BOOLEAN,
    "inicioEm" TIMESTAMP(3),
    "fimEm" TIMESTAMP(3),
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConteudoRegional_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ConteudoRegionalToRoadmap" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ConteudoRegionalToRoadmap_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ConteudoRegional_estado_cidade_idx" ON "ConteudoRegional"("estado", "cidade");

-- CreateIndex
CREATE INDEX "ConteudoRegional_tipo_idx" ON "ConteudoRegional"("tipo");

-- CreateIndex
CREATE INDEX "_ConteudoRegionalToRoadmap_B_index" ON "_ConteudoRegionalToRoadmap"("B");

-- AddForeignKey
ALTER TABLE "_ConteudoRegionalToRoadmap" ADD CONSTRAINT "_ConteudoRegionalToRoadmap_A_fkey" FOREIGN KEY ("A") REFERENCES "ConteudoRegional"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConteudoRegionalToRoadmap" ADD CONSTRAINT "_ConteudoRegionalToRoadmap_B_fkey" FOREIGN KEY ("B") REFERENCES "Roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;

