"use client";

import { useOptimistic, useState, useTransition } from "react";
import { marcarTopico } from "@/app/roadmaps/[id]/actions";

type Props = {
  roadmapId: string;
  topicId: string;
  titulo: string;
  concluido: boolean;
};

// Checkbox "Concluído" de um tópico. Marca na hora (otimista) e desfaz se o
// servidor recusar; os contadores da etapa atualizam quando a página revalida.
export function TopicoCheck({ roadmapId, topicId, titulo, concluido }: Props) {
  const [marcado, setMarcadoOtimista] = useOptimistic(concluido);
  const [pendente, startTransition] = useTransition();
  const [erro, setErro] = useState<string | null>(null);

  function alternar(novo: boolean) {
    setErro(null);
    startTransition(async () => {
      setMarcadoOtimista(novo);
      const resultado = await marcarTopico(roadmapId, topicId, novo);
      if (!resultado.ok) setErro(resultado.erro);
    });
  }

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <label
        className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
          marcado
            ? "border-success/40 bg-success/10 text-success-active dark:text-success-hover"
            : "border-border text-muted hover:text-foreground"
        } ${pendente ? "opacity-70" : ""}`}
      >
        <input
          type="checkbox"
          checked={marcado}
          onChange={(e) => alternar(e.target.checked)}
          aria-label={`Marcar "${titulo}" como concluído`}
          className="h-4 w-4 accent-success"
        />
        {marcado ? "Concluído" : "Marcar como concluído"}
      </label>
      {erro && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {erro}
        </p>
      )}
    </div>
  );
}
