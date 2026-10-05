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
    url: process.env.DATABASE_URL,
  },
});
