import { Ratelimit, type Duration } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const upstashConfigurado = Boolean(
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

// Em desenvolvimento, sem Upstash configurado, o rate limit é ignorado para
// dar para rodar o app localmente. Em produção o Upstash continua obrigatório.
const semRateLimit = !upstashConfigurado && process.env.NODE_ENV !== "production";

if (semRateLimit) {
  console.warn("[rate-limit] Upstash não configurado: rate limit desativado em desenvolvimento.");
}

type Limitador = Pick<Ratelimit, "limit">;

const semLimite: Limitador = {
  limit: async () => ({ success: true, limit: 0, remaining: 0, reset: 0, pending: Promise.resolve() }),
};

let redis: Redis | undefined;

function criarRatelimit(prefix: string, requisicoes: number, janela: Duration): Limitador {
  if (semRateLimit) return semLimite;

  redis ??= Redis.fromEnv();
  return new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(requisicoes, janela),
    prefix,
  });
}

// Formulários públicos (lista de espera e cadastro), por IP.
export const ratelimit = criarRatelimit("bussola:leads", 5, "1 m");

// Edição do perfil, por usuário. Mais folgado: quem está logado salva o
// formulário e troca a foto algumas vezes seguidas sem problema.
export const ratelimitPerfil = criarRatelimit("bussola:perfil", 20, "1 m");
