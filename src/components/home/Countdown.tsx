"use client";

import { useEffect, useState } from "react";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

export const DEFAULT_LAUNCH_DATE =
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-11-05T00:00:00-03:00";

type CountdownProps = {
  target?: string;
  label?: string;
  className?: string;
};

export function Countdown({
  target = DEFAULT_LAUNCH_DATE,
  label,
  className,
}: CountdownProps) {
  const [time, setTime] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const update = () => {
      const diff = Math.max(0, new Date(target).getTime() - Date.now());
      if (Number.isNaN(diff)) {
        setTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTime({
        days: Math.floor(diff / DAY),
        hours: Math.floor((diff % DAY) / HOUR),
        minutes: Math.floor((diff % HOUR) / MINUTE),
        seconds: Math.floor((diff % MINUTE) / SECOND),
      });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { label: "Dias", value: time?.days },
    { label: "Horas", value: time?.hours },
    { label: "Min", value: time?.minutes },
    { label: "Seg", value: time?.seconds },
  ];

  return (
    <div role="timer" className={className}>
      {label ? (
        <p className="text-xs font-medium tracking-[0.18em] text-white/50 uppercase">
          {label}
        </p>
      ) : null}

      <div aria-hidden="true" className="mt-4 flex gap-2 sm:gap-4">
        {units.map(({ label: unitLabel, value }) => (
          <div key={unitLabel} className="flex flex-col items-center gap-2">
            <span className="flex h-14 w-14 items-center justify-center rounded-lg bg-night-soft text-xl font-semibold text-white tabular-nums ring-1 ring-night-line sm:h-[4.5rem] sm:w-[4.5rem] sm:text-3xl">
              {value !== undefined ? String(value).padStart(2, "0") : "--"}
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
