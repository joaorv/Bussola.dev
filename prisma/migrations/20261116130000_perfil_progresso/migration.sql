-- AlterTable
ALTER TABLE "User" ADD COLUMN "areasInteresse" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Usuários que já existem herdam as áreas do pré-cadastro com o mesmo e-mail.
UPDATE "User" u
SET "areasInteresse" = l."areasInteresse"
FROM "Lead" l
WHERE l."email" = u."email";

-- CreateTable
CREATE TABLE "ProgressoTopico" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "topicId" TEXT NOT NULL,
    "concluidoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProgressoTopico_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProgressoTopico_userId_idx" ON "ProgressoTopico"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProgressoTopico_userId_roadmapId_topicId_key" ON "ProgressoTopico"("userId", "roadmapId", "topicId");

-- AddForeignKey
ALTER TABLE "ProgressoTopico" ADD CONSTRAINT "ProgressoTopico_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
