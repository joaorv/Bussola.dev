import { PrismaClient } from "@prisma/client";

// Evita criar várias conexões com o banco durante o hot-reload do Next.js
// em desenvolvimento. Padrão recomendado pela própria documentação do Prisma.
// https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
