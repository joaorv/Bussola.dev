"use client";

import { useEffect, useRef, useState } from "react";
import { TermsCheckbox } from "./TermsCheckbox";
import { TermsContent, TermsMeta } from "./TermsContent";

type TermsModalProps = {
  /** Chamado ao clicar em "Aceitar Termos" (com o checkbox marcado). */
  onAccept: () => void;
  onClose: () => void;
  /** Enquanto true, o modal mostra "Enviando..." e não pode ser fechado. */
  enviando?: boolean;
};

/**
 * Modal com o texto completo dos Termos de Uso e a caixa de concordância.
 * Abre ao ser montado: renderize-o só quando ele deve aparecer.
 */
export function TermsModal({
  onAccept,
  onClose,
  enviando = false,
}: TermsModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [concordo, setConcordo] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    // showModal() dá de graça o foco preso no modal, o fundo inerte e o Esc.
    dialog.showModal();
    return () => dialog.close();
  }, []);

  function fechar() {
    if (!enviando) onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="termos-modal-titulo"
      onCancel={(e) => {
        // Esc: quem decide fechar é o componente pai.
        e.preventDefault();
        fechar();
      }}
      onClick={(e) => {
        // Clique no fundo escurecido (fora do cartão) fecha o modal.
        if (e.target === e.currentTarget) fechar();
      }}
      className="m-auto w-[calc(100%-2*var(--spacing-gutter))] max-w-2xl rounded-lg border border-border bg-surface p-0 text-foreground shadow-xl shadow-black/30 backdrop:bg-night-deep/70"
    >
      <div className="flex max-h-[90dvh] flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-border p-card">
          <div>
            <h2
              id="termos-modal-titulo"
              className="text-2xl font-semibold text-foreground"
            >
              Termos de Uso
            </h2>
            <div className="mt-3">
              <TermsMeta />
            </div>
          </div>

          <button
            type="button"
            onClick={fechar}
            disabled={enviando}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-muted transition-colors hover:bg-background hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span className="sr-only">Fechar</span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              aria-hidden="true"
              className="h-5 w-5"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </header>

        {/* Só o texto rola; o checkbox e o botão ficam sempre visíveis. */}
        <div className="min-h-0 flex-1 overflow-y-auto p-card">
          <TermsContent headingLevel="h3" />
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (concordo && !enviando) onAccept();
          }}
          className="flex flex-col gap-4 border-t border-border p-card"
        >
          <TermsCheckbox
            id="termos-modal-aceite"
            checked={concordo}
            disabled={enviando}
            onChange={setConcordo}
          />

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={fechar}
              disabled={enviando}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-muted hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!concordo || enviando}
              className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
            >
              {enviando ? "Enviando..." : "Aceitar Termos"}
            </button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
