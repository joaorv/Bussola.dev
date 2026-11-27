-- Localização em cidade + estado (UF) no lugar do texto livre, para o app
-- cruzar a pessoa com o conteúdo regional.

-- AlterTable
ALTER TABLE "User" ADD COLUMN "cidade" TEXT,
ADD COLUMN "estado" TEXT;

-- Converte o que já existia. "Campinas, SP", "Campinas - SP" e "Campinas/SP"
-- viram cidade + UF; o resto vai inteiro para `cidade`, para nada se perder.
UPDATE "User"
SET "cidade" = NULLIF(TRIM(SUBSTRING("localizacao" FROM '^(.*?)[[:space:]]*[,/-][[:space:]]*[A-Za-z]{2}[[:space:]]*$')), ''),
    "estado" = UPPER(SUBSTRING("localizacao" FROM '[,/-][[:space:]]*([A-Za-z]{2})[[:space:]]*$'))
WHERE "localizacao" ~ '[,/-][[:space:]]*(AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)[[:space:]]*$';

UPDATE "User"
SET "cidade" = NULLIF(TRIM("localizacao"), '')
WHERE "localizacao" IS NOT NULL AND "cidade" IS NULL AND "estado" IS NULL;

-- "localizacao" continua no banco por enquanto: a versão publicada do app
-- ainda lê essa coluna. Remover numa próxima migration, depois do deploy.
