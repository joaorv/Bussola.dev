import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { emailSchema } from "@/lib/lead-validation";

// Custo do bcrypt. O cadastro deve gerar o hash com este mesmo valor, para que
// o DUMMY_HASH abaixo leve o mesmo tempo que um hash real.
export const BCRYPT_COST = 10;

// Hash de uma senha qualquer, comparado quando o e-mail não existe. Sem isso o
// login responderia bem mais rápido para e-mails não cadastrados, o que
// permitiria descobrir quem tem conta pelo tempo de resposta.
const DUMMY_HASH =
  "$2b$10$9rkXPteHoDGMmAxayaUA..qnvLIRdT9p6GpY9y54VABozDea0cYju";

const credenciaisSchema = z.object({
  email: emailSchema,
  // Limite superior evita gastar CPU do bcrypt com payloads enormes.
  password: z.string().min(1).max(128),
});

export const authOptions: NextAuthOptions = {
  // Explícito porque, em produção (Vercel, Docker, standalone), o NextAuth nem
  // sempre lê a variável sozinho e o getServerSession falha com NO_SECRET.
  secret: process.env.NEXTAUTH_SECRET,
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
      async authorize(credentials) {
        const resultado = credenciaisSchema.safeParse(credentials);

        if (!resultado.success) {
          return null;
        }

        const { email, password } = resultado.data;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        const senhaValida = await compare(
          password,
          user?.senhaHash ?? DUMMY_HASH
        );

        if (!user || !senhaValida) {
          return null;
        }

        return { id: user.id, name: user.nome, email: user.email };
      },
    }),
  ],
  callbacks: {
    // O id só chega em `user` no momento do login; daí em diante ele vive no
    // JWT e é repassado para a sessão a cada leitura.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
      }

      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

// Sessão do usuário logado em Server Components, Route Handlers e Server
// Actions. Retorna null quando não há login.
export function getSession() {
  return getServerSession(authOptions);
}
