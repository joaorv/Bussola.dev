// Data de lançamento da plataforma, usada pelo contador regressivo.
//
// A contagem zera na virada para 5 de novembro. Pode ser sobrescrita por
// ambiente com NEXT_PUBLIC_LAUNCH_DATE — o prefixo NEXT_PUBLIC_ é
// obrigatório, porque o contador roda no navegador.
//
// Sempre ISO 8601 com fuso explícito (-03:00 = horário de Brasília), para que
// a contagem seja a mesma independente do relógio de quem acessa.
export const LAUNCH_DATE =
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-11-05T00:00:00-03:00";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export type TimeRemaining = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true quando a data alvo já passou — todos os campos ficam em zero. */
  finished: boolean;
};

/**
 * Quanto falta entre `now` e `target`, quebrado em dias/horas/minutos/segundos.
 * Nunca retorna valores negativos: depois do lançamento, tudo vira zero.
 */
export function getTimeRemaining(
  target: string | number | Date,
  now: number = Date.now(),
): TimeRemaining {
  const targetMs = new Date(target).getTime();

  // Data inválida (env mal preenchida) não deve derrubar a página: trata como
  // lançamento já ocorrido, que é o estado neutro do contador.
  if (Number.isNaN(targetMs)) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, finished: true };
  }

  const diff = Math.max(0, targetMs - now);

  return {
    days: Math.floor(diff / DAY),
    hours: Math.floor((diff % DAY) / HOUR),
    minutes: Math.floor((diff % HOUR) / MINUTE),
    seconds: Math.floor((diff % MINUTE) / SECOND),
    finished: diff === 0,
  };
}
