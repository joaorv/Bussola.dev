import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",

  migrations: {
    path: "prisma/migrations",
  },

  datasource: {
    // process.env em vez de env(): o env() lança erro se a variável não
    // existir, o que quebraria o `prisma generate` do postinstall em ambientes
    // sem DATABASE_URL (CI, clone novo). O generate não precisa da URL.
    //
    // O Prisma Migrate precisa de conexão direta: pelo pooler do Neon
    // (host com "-pooler") o migrate deploy do build na Vercel falha. O app
    // continua usando o pooler (src/lib/prisma.ts); só o CLI conecta direto.
    // DATABASE_URL_UNPOOLED é o nome que a integração Neon + Vercel cria.
    url:
      process.env.DATABASE_URL_UNPOOLED ??
      process.env.DATABASE_URL?.replace("-pooler.", "."),
  },
});
