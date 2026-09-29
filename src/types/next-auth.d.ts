import type { DefaultSession } from "next-auth";

// Acrescenta o id do usuário à sessão e ao JWT (ver callbacks em src/lib/auth.ts).
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
  }
}
