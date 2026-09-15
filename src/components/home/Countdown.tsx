"use client";

import { useEffect, useState } from "react";
import { getTimeRemaining, type TimeRemaining } from "@/lib/launch";

type Unit = {
  key: keyof Omit<TimeRemaining, "finished">;
  label: string;
  /** singular/plural para o resumo lido por leitores de tela */
  spoken: [one: string, many: string];
};

const UNITS: Unit[] = [
  { key: "days", label: "Dias", spoken: ["dia", "dias"] },
  { key: "hours", label: "Horas", spoken: ["hora", "horas"] },
  { key: "minutes", label: "Min", spoken: ["minuto", "minutos"] },
  { key: "seconds", label: "Seg", spoken: ["segundo", "segundos"] },
];

function describe(remaining: TimeRemaining) {
  if (remaining.finished) {
    return "A plataforma já foi lançada.";
  }

  const parts = UNITS.map(({ key, spoken }) => {
    const value = remaining[key];
    return `${value} ${value === 1 ? spoken[0] : spoken[1]}`;
  });

  return `Faltam ${parts.slice(0, -1).join(", ")} e ${parts.at(-1)} para o lançamento.`;
}

type CountdownProps = {
  /** Data alvo em ISO 8601 com fuso explícito. */
  target: string;
  label?: string;
  className?: string;
};

export function Countdown({ target, label, className }: CountdownProps) {
  // Começa em null e só ganha valor depois da montagem: o HTML do servidor
  // seria calculado num instante diferente do cliente e quebraria a
  // hidratação. Até lá as caixas aparecem com "--", sem pulo de layout.
  const [remaining, setRemaining] = useState<TimeRemaining | null>(null);

  useEffect(() => {
    // Recalcula a partir do relógio a cada tique, em vez de decrementar um
    // contador: assim a contagem não acumula desvio quando o navegador
    // engasga ou estrangula timers de abas em segundo plano.
    const update = () => setRemaining(getTimeRemaining(target));

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  return (
    // role="timer" já implica aria-live="off": o resumo abaixo fica disponível
    // para leitura sob demanda, sem ser anunciado a cada segundo.
    <div role="timer" className={className}>
      {label ? (
        <p className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">
          {label}
        </p>
      ) : null}

      <span className="sr-only">
        {remaining ? describe(remaining) : "Carregando a contagem regressiva."}
      </span>

      <div aria-hidden="true" className="mt-4 flex gap-3 sm:gap-4">
        {UNITS.map(({ key, label: unitLabel }) => (
          <div key={key} className="flex flex-col items-center gap-2">
            <span className="flex h-16 w-16 items-center justify-center rounded-lg bg-night-soft text-2xl font-semibold text-white tabular-nums ring-1 ring-night-line sm:h-[4.5rem] sm:w-[4.5rem] sm:text-3xl">
              {remaining ? String(remaining[key]).padStart(2, "0") : "--"}
            </span>
            <span className="text-[0.65rem] font-medium tracking-widest text-white/50 uppercase">
              {unitLabel}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
