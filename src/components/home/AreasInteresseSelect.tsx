"use client";

import { useEffect, useId, useRef, useState } from "react";

type Props = {
  opcoes: readonly string[];
  selecionadas: string[];
  onToggle: (area: string, marcada: boolean) => void;
  // Texto exibido no resumo no lugar do nome da opção (ex.: "Outro" -> o que foi digitado).
  rotulos?: Partial<Record<string, string>>;
  erro?: string;
};

// Select recolhido com múltipla escolha: mostra o resumo do que foi marcado e
// abre uma lista de checkboxes ao clicar.
export function AreasInteresseSelect({ opcoes, selecionadas, onToggle, rotulos, erro }: Props) {
  const [aberto, setAberto] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const botaoRef = useRef<HTMLButtonElement>(null);
  const listaId = useId();
  const erroId = useId();

  useEffect(() => {
    if (!aberto) return;

    function fecharAoClicarFora(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setAberto(false);
    }
    function fecharComEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAberto(false);
        botaoRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", fecharAoClicarFora);
    document.addEventListener("keydown", fecharComEsc);
    return () => {
      document.removeEventListener("mousedown", fecharAoClicarFora);
      document.removeEventListener("keydown", fecharComEsc);
    };
  }, [aberto]);

  const nomes = selecionadas.map((area) => rotulos?.[area]?.trim() || area);
  const resumo =
    nomes.length === 0
      ? "Selecione suas áreas de interesse"
      : nomes.length <= 2
      ? nomes.join(", ")
      : `${nomes.slice(0, 2).join(", ")} +${nomes.length - 2}`;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={botaoRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={aberto}
        aria-controls={listaId}
        aria-describedby={erro ? erroId : undefined}
        aria-label={`Áreas de interesse: ${
          nomes.length === 0 ? "nenhuma selecionada" : nomes.join(", ")
        }`}
        onClick={() => setAberto((v) => !v)}
        className={`flex w-full items-center justify-between gap-3 rounded-md border bg-white p-3 text-left outline-none ${
          erro ? "border-red-500" : "border-white/20"
        }`}
      >
        <span className={`truncate ${selecionadas.length === 0 ? "text-gray-500" : "text-black"}`}>
          {resumo}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-4 w-4 shrink-0 text-gray-600 transition-transform ${aberto ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.17l3.71-3.94a.75.75 0 1 1 1.08 1.04l-4.25 4.5a.75.75 0 0 1-1.08 0l-4.25-4.5a.75.75 0 0 1 .02-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {aberto && (
        <div
          id={listaId}
          role="group"
          aria-label="Áreas de interesse"
          className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-y-auto rounded-md border border-gray-200 bg-white py-1 text-black shadow-lg"
        >
          {opcoes.map((area) => (
            <label
              key={area}
              className="flex cursor-pointer items-center gap-3 px-3 py-2 text-sm hover:bg-gray-100"
            >
              <input
                type="checkbox"
                checked={selecionadas.includes(area)}
                onChange={(e) => onToggle(area, e.target.checked)}
                className="h-4 w-4 shrink-0 accent-accent"
              />
              {area}
            </label>
          ))}
        </div>
      )}

      {erro && (
        <p id={erroId} className="mt-1 text-sm text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}
