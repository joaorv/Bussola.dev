-- AlterTable
ALTER TABLE "User" ADD COLUMN     "profissao" TEXT,
ADD COLUMN     "localizacao" TEXT,
ADD COLUMN     "sobre" TEXT,
ADD COLUMN     "linkedinUrl" TEXT,
ADD COLUMN     "githubUrl" TEXT,
ADD COLUMN     "siteUrl" TEXT,
ADD COLUMN     "foto" BYTEA,
ADD COLUMN     "fotoTipo" TEXT,
ADD COLUMN     "fotoAtualizadaEm" TIMESTAMP(3);
