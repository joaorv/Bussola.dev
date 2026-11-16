import { Ratelimit } from "@upstash/ratelimit";
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

export const ratelimit: Pick<Ratelimit, "limit"> = semRateLimit
  ? { limit: async () => ({ success: true, limit: 0, remaining: 0, reset: 0, pending: Promise.resolve() }) }
  : new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(5, "1 m"),
      prefix: "bussola:leads",
    });
