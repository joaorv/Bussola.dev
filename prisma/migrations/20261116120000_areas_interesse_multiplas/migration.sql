-- A área de interesse passa a aceitar múltiplas escolhas.
-- Renomeia a coluna e converte o valor de cada lead existente em uma lista de um item.
ALTER TABLE "Lead" RENAME COLUMN "areaInteresse" TO "areasInteresse";
ALTER TABLE "Lead" ALTER COLUMN "areasInteresse" TYPE TEXT[] USING ARRAY["areasInteresse"];
