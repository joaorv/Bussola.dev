import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Configuração base do NextAuth (Auth.js).
// A lógica de verificação do usuário (comparar email/senha no banco via
// Prisma) ainda precisa ser implementada dentro de `authorize` quando o
// cadastro/login for construído.
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credenciais",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize() {
        // TODO: buscar o usuário no banco (via prisma) e validar a senha.
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
};
