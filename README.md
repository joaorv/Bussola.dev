# Bússola.dev

Sua trilha de carreira em tecnologia, conectada à sua região: roadmap de estudos com cursos, empresas, eventos e comunidades perto de você.

Hoje o projeto tem a landing page com lista de espera (captação de leads) e a base de autenticação com NextAuth.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS 4](https://tailwindcss.com/)
- [PostgreSQL](https://www.postgresql.org/) com [Prisma 7](https://www.prisma.io/) (driver adapter `@prisma/adapter-pg`)
- [NextAuth.js v4](https://next-auth.js.org/) com login por e-mail e senha (hash com `bcryptjs`)
- [Upstash Redis](https://upstash.com/) para rate limit do formulário de leads
- [Zod](https://zod.dev/) para validação

## Pré-requisitos

- **Node.js 20.9 ou superior** (exigência do Next 16) e npm
- Um banco **PostgreSQL**, local ou na nuvem (Neon, Render, Railway…)
- Um banco **Upstash Redis**, que tem plano gratuito, para o rate limit do `/api/leads`

## Rodando localmente

### 1. Clonar

```bash
git clone https://github.com/joaorv/Bussola.dev.git
cd Bussola.dev
```

### 2. Criar o `.env`

Crie um arquivo `.env` na raiz do projeto. Ele está no `.gitignore` e **nunca deve ser commitado**.

```env
# PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/bussola_dev"

# NextAuth
NEXTAUTH_SECRET="gere-uma-chave-aleatoria"
NEXTAUTH_URL="http://localhost:3000"

# Upstash Redis (rate limit do formulário de leads)
UPSTASH_REDIS_REST_URL="https://xxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="xxxx"

# Opcional: data de lançamento usada pelo contador regressivo
# NEXT_PUBLIC_LAUNCH_DATE="2026-11-05T00:00:00-03:00"
```

| Variável | Obrigatória | Para que serve |
| --- | --- | --- |
| `DATABASE_URL` | Sim | Connection string do PostgreSQL. É usada pelo app e pelo Prisma CLI. |
| `NEXTAUTH_SECRET` | Sim | Chave que assina o JWT da sessão. Gere com `openssl rand -base64 32` ou `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`. |
| `NEXTAUTH_URL` | Sim | URL pública do app. Em dev, `http://localhost:3000`. |
| `UPSTASH_REDIS_REST_URL` | Sim | URL REST do Redis, no painel do Upstash. Sem ela, o `POST /api/leads` falha. |
| `UPSTASH_REDIS_REST_TOKEN` | Sim | Token REST do Redis, no mesmo painel. |
| `NEXT_PUBLIC_LAUNCH_DATE` | Não | Data do lançamento em ISO 8601 com fuso. O padrão fica em `src/lib/launch.ts`. |

### 3. Instalar as dependências

```bash
npm install
```

O `postinstall` roda `prisma generate`, que gera o client em `src/generated/prisma`, uma pasta que não é versionada.

> **Windows:** o script de `postinstall` usa sintaxe de bash e falha no `cmd`/PowerShell com `'DATABASE_URL' não é reconhecido...`. As dependências são instaladas mesmo assim. Com o `.env` já criado, gere o client manualmente:
>
> ```bash
> npx prisma generate
> ```

### 4. Aplicar as migrations

```bash
npx prisma migrate deploy
```

Esse comando cria as tabelas `Lead` e `User` no banco do `DATABASE_URL`. Se você for **alterar o schema**, use `npx prisma migrate dev --name descricao-da-mudanca`, que gera uma migration nova.

### 5. Subir o servidor

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento com hot reload |
| `npm run build` | Build de produção |
| `npm run start` | Sobe o build de produção (rode `build` antes) |
| `npm run lint` | ESLint |
| `npx prisma studio` | Interface web para ver e editar o banco |

## Autenticação

A configuração fica em [`src/lib/auth.ts`](src/lib/auth.ts), e as rotas do NextAuth ficam em `/api/auth/*`.

- **Provider:** credenciais (e-mail e senha). O e-mail é normalizado para minúsculas, e a senha é conferida contra o `senhaHash` (bcrypt, custo `BCRYPT_COST`) da tabela `User`.
- **Sessão:** JWT em cookie, sem tabela de sessão. O `id` do usuário vai para `session.user.id`, com os tipos em [`src/types/next-auth.d.ts`](src/types/next-auth.d.ts).
- **Página de login:** configurada como `/login`, que **ainda não existe**.
- **Cadastro:** **ainda não existe**. Quando for criado, o hash precisa usar o mesmo `BCRYPT_COST` exportado de `src/lib/auth.ts`.

Para ler a sessão no servidor (Server Components, Route Handlers e Server Actions):

```ts
import { getSession } from "@/lib/auth";

const session = await getSession();
if (!session) {
  // não logado
}
session.user.id; // id do usuário
```

### Criando um usuário de teste

Enquanto não há tela de cadastro, dá para criar um usuário direto no banco:

1. Gere o hash da senha:
   ```bash
   node -e "console.log(require('bcryptjs').hashSync('minha-senha', 10))"
   ```
2. Rode `npx prisma studio`, abra a tabela `User` e adicione um registro com `nome`, `email` (em minúsculas) e o hash no campo `senhaHash`.

Para testar o login sem interface, rode no console do navegador, com `http://localhost:3000` aberto (a página padrão `/api/auth/signin` redireciona para `/login`, que ainda não existe):

```js
const { csrfToken } = await (await fetch("/api/auth/csrf")).json();
await fetch("/api/auth/callback/credentials", {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ csrfToken, email: "voce@exemplo.com", password: "minha-senha" }),
});
await (await fetch("/api/auth/session")).json(); // { user: { id, name, email }, expires }
```

Com credenciais erradas, a sessão volta vazia (`{}`).

## API

| Rota | Método | Descrição |
| --- | --- | --- |
| `/api/leads` | `POST` | Cadastra um lead da lista de espera (`nome`, `email`, `areaInteresse`). Tem rate limit de 5 requisições por minuto por IP. |
| `/api/auth/*` | `GET`/`POST` | Rotas do NextAuth (signin, callback, session, csrf, signout). |

## Estrutura

```
prisma/
  schema.prisma          # models Lead e User
  migrations/            # histórico de migrations (versionado)
src/
  app/
    api/auth/[...nextauth]/route.ts   # handler do NextAuth
    api/leads/route.ts                # captação de leads
    layout.tsx, page.tsx              # layout e landing page
  components/
    home/                # seções da landing (Hero, Countdown, HowItWorks, LeadForm)
    layout/              # Header, Footer
  lib/
    auth.ts              # configuração do NextAuth + getSession()
    prisma.ts            # instância única do Prisma Client
    rate-limit.ts        # rate limit (Upstash)
    lead-validation.ts   # schemas Zod compartilhados
    launch.ts            # data de lançamento do contador
  types/                 # augmentations de tipos (next-auth)
  generated/prisma/      # client gerado pelo Prisma (não versionado)
```

## Equipe

João Victor Aparecido · Fernando Dias · Gustavo André

## Licença

[MIT](LICENSE)
