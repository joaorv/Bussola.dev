"use client";

import { useEffect } from "react";

type ToastProps = {
  type: "sucesso" | "erro";
  title: string;
  description: string;
  onClose: () => void;
  duration?: number;
};

export function Toast({ type, title, description, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const sucesso = type === "sucesso";

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-gutter pt-4 sm:justify-end sm:pt-6">
      <div
        role={sucesso ? "status" : "alert"}
        className="toast-enter pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-lg border border-border bg-surface p-4 shadow-lg shadow-black/10"
      >
        <span
          aria-hidden="true"
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            sucesso ? "bg-success/15 text-success" : "bg-red-500/15 text-red-500"
          }`}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            {sucesso ? (
              <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
            ) : (
              <path d="M10 5.5v5.5M10 14.5v.01" strokeLinecap="round" />
            )}
          </svg>
        </span>

        <div className="flex-1 pt-0.5">
          <p className="text-sm font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="-m-1 rounded-md p-1 text-muted transition-colors hover:bg-background hover:text-foreground"
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
            <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
