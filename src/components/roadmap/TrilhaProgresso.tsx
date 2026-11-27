"use client";

import {
  createContext,
  useContext,
  useMemo,
  useOptimistic,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { marcarTopicos } from "@/app/roadmaps/[id]/actions";
import { LevelBadge } from "@/components/roadmap/LevelBadge";
import type { TopicLevel } from "@/lib/roadmaps";

// Estado de progresso da trilha compartilhado por toda a página: checklist da
// etapa, checkbox dos cards, contadores, barra do topo e ✓ do sumário leem
// daqui. As marcações aparecem na hora (useOptimistic) e voltam atrás sozinhas
// se o servidor recusar; quando ele confirma, a página revalida e o estado
// "oficial" chega de novo pelas props.

type Mudanca = { ids: string[]; concluido: boolean };

type TrilhaContexto = {
  feitos: Set<string>;
  // Chaves ("topico:<id>" ou "etapa:<id>") com gravação em andamento / com erro.
  pendentes: Set<string>;
  erros: Record<string, string>;
  marcar: (chave: string, ids: string[], concluido: boolean) => void;
};

const Contexto = createContext<TrilhaContexto | null>(null);

function useTrilha() {
  const ctx = useContext(Contexto);
  if (!ctx) throw new Error("useTrilha precisa estar dentro de <TrilhaProgressoProvider>.");
  return ctx;
}

function contar(feitos: Set<string>, ids: string[]) {
  return ids.reduce((n, id) => (feitos.has(id) ? n + 1 : n), 0);
}

function percentual(concluidos: number, total: number) {
  return total ? Math.round((concluidos / total) * 100) : 0;
}

export function TrilhaProgressoProvider({
  roadmapId,
  concluidos,
  children,
}: {
  roadmapId: string;
  concluidos: string[];
  children: ReactNode;
}) {
  const base = useMemo(() => new Set(concluidos), [concluidos]);
  const [feitos, aplicar] = useOptimistic(base, (atual, { ids, concluido }: Mudanca) => {
    const novo = new Set(atual);
    for (const id of ids) {
      if (concluido) novo.add(id);
      else novo.delete(id);
    }
    return novo;
  });
  const [pendentes, setPendentes] = useState<Set<string>>(() => new Set());
  const [erros, setErros] = useState<Record<string, string>>({});
  const [, startTransition] = useTransition();

  function marcar(chave: string, ids: string[], concluido: boolean) {
    setErros((atual) => {
      const resto = { ...atual };
      delete resto[chave];
      return resto;
    });
    setPendentes((atual) => new Set(atual).add(chave));

    startTransition(async () => {
      aplicar({ ids, concluido });
      const resultado = await marcarTopicos(roadmapId, ids, concluido);
      if (!resultado.ok) setErros((atual) => ({ ...atual, [chave]: resultado.erro }));
      setPendentes((atual) => {
        const novo = new Set(atual);
        novo.delete(chave);
        return novo;
      });
    });
  }

  return (
    <Contexto.Provider value={{ feitos, pendentes, erros, marcar }}>
      {children}
    </Contexto.Provider>
  );
}

function BarraProgresso({
  concluidos,
  total,
  rotulo,
  trilhoClassName,
}: {
  concluidos: number;
  total: number;
  rotulo: string;
  trilhoClassName: string;
}) {
  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={concluidos}
      className={`h-2 overflow-hidden rounded-full ${trilhoClassName}`}
    >
      <div
        className="h-full rounded-full bg-success transition-[width] duration-300"
        style={{ width: `${percentual(concluidos, total)}%` }}
      />
    </div>
  );
}

// Barra "Seu progresso" no topo da trilha.
export function ProgressoGeral({ topicIds }: { topicIds: string[] }) {
  const { feitos } = useTrilha();
  const concluidos = contar(feitos, topicIds);
  const total = topicIds.length;

  return (
    <div className="mt-6 max-w-md">
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-white/70">Seu progresso</span>
        <span className="tabular-nums text-white">
          {concluidos}/{total} · {percentual(concluidos, total)}%
        </span>
      </div>
      <BarraProgresso
        concluidos={concluidos}
        total={total}
        rotulo="Seu progresso nesta trilha"
        trilhoClassName="mt-2 bg-night-line"
      />
    </div>
  );
}

function useEtapaConcluida(topicIds: string[]) {
  const { feitos } = useTrilha();
  return topicIds.length > 0 && contar(feitos, topicIds) === topicIds.length;
}

// ✓ ao lado do nome da etapa no sumário lateral.
export function SeloEtapaSumario({ topicIds }: { topicIds: string[] }) {
  return useEtapaConcluida(topicIds) ? (
    <span className="text-success" aria-label="Etapa concluída">
      ✓
    </span>
  ) : null;
}

// Círculo numerado da linha do tempo; vira ✓ verde com a etapa concluída.
export function MarcadorEtapa({ ordem, topicIds }: { ordem: number; topicIds: string[] }) {
  const concluida = useEtapaConcluida(topicIds);

  return (
    <span
      aria-hidden="true"
      className={`absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white transition-colors ${
        concluida ? "bg-success" : "bg-brand"
      }`}
    >
      {concluida ? "✓" : ordem}
    </span>
  );
}

// "x/y concluídos" ou "Etapa concluída", ao lado do título da etapa.
export function ContadorEtapa({ topicIds }: { topicIds: string[] }) {
  const { feitos } = useTrilha();
  const concluidos = contar(feitos, topicIds);
  const concluida = topicIds.length > 0 && concluidos === topicIds.length;

  return (
    <p
      className={`text-sm tabular-nums ${
        concluida ? "font-medium text-success-active dark:text-success-hover" : "text-muted"
      }`}
    >
      {concluida ? "Etapa concluída" : `${concluidos}/${topicIds.length} concluídos`}
    </p>
  );
}

type ItemChecklist = { id: string; titulo: string; level: TopicLevel };

// Checklist enxuto da etapa: barra de progresso, um checkbox por tópico e o
// botão que marca (ou desmarca) a etapa inteira.
export function ChecklistEtapa({
  etapaId,
  etapaNome,
  topicos,
}: {
  etapaId: string;
  etapaNome: string;
  topicos: ItemChecklist[];
}) {
  const { feitos, pendentes, erros, marcar } = useTrilha();
  const ids = topicos.map((t) => t.id);
  const concluidos = contar(feitos, ids);
  const concluida = ids.length > 0 && concluidos === ids.length;
  const chaveEtapa = `etapa:${etapaId}`;
  const erro =
    erros[chaveEtapa] ?? topicos.map((t) => erros[`topico:${t.id}`]).find(Boolean);

  function alternarEtapa() {
    if (concluida) {
      const ok = window.confirm(
        `Desmarcar todos os ${ids.length} tópicos de "${etapaNome}"? As datas de conclusão serão perdidas.`
      );
      if (ok) marcar(chaveEtapa, ids, false);
    } else {
      marcar(chaveEtapa, ids.filter((id) => !feitos.has(id)), true);
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-border bg-surface p-card">
      <div className="flex items-center gap-3">
        <BarraProgresso
          concluidos={concluidos}
          total={ids.length}
          rotulo={`Progresso da etapa ${etapaNome}`}
          trilhoClassName="flex-1 bg-ink-100"
        />
        <span className="w-10 text-right text-xs font-medium tabular-nums text-muted">
          {percentual(concluidos, ids.length)}%
        </span>
      </div>

      <ul className="mt-3 divide-y divide-border">
        {topicos.map((topico) => {
          const marcado = feitos.has(topico.id);
          return (
            <li key={topico.id}>
              <label className="flex cursor-pointer items-center gap-3 py-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={marcado}
                  onChange={(e) => marcar(`topico:${topico.id}`, [topico.id], e.target.checked)}
                  className="h-4 w-4 shrink-0 accent-success"
                />
                <span
                  className={`min-w-0 flex-1 transition-colors ${
                    marcado ? "text-muted line-through decoration-muted/60" : "text-foreground"
                  }`}
                >
                  {topico.titulo}
                </span>
                <LevelBadge level={topico.level} />
              </label>
            </li>
          );
        })}
      </ul>

      <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={alternarEtapa}
          disabled={pendentes.has(chaveEtapa)}
          className={
            concluida
              ? "inline-flex h-9 items-center justify-center rounded-md border border-border px-4 text-sm font-medium text-muted transition-colors hover:bg-ink-100 hover:text-foreground disabled:opacity-60"
              : "inline-flex h-9 items-center justify-center rounded-md bg-success px-4 text-sm font-medium text-white transition-colors hover:bg-success-hover active:bg-success-active disabled:opacity-60"
          }
        >
          {concluida ? "Desmarcar etapa" : "Marcar etapa como concluída"}
        </button>
        {erro && (
          <p role="alert" className="text-xs text-red-600 dark:text-red-400">
            {erro}
          </p>
        )}
      </div>
    </div>
  );
}

// Card do tópico: a borda fica verde quando ele está concluído.
export function CardTopico({ topicId, children }: { topicId: string; children: ReactNode }) {
  const { feitos } = useTrilha();

  return (
    <li
      className={`rounded-lg border bg-surface p-card transition-colors ${
        feitos.has(topicId) ? "border-success/40" : "border-border"
      }`}
    >
      {children}
    </li>
  );
}

// Checkbox "Concluído" dentro do card do tópico.
export function TopicoCheck({ topicId, titulo }: { topicId: string; titulo: string }) {
  const { feitos, pendentes, erros, marcar } = useTrilha();
  const chave = `topico:${topicId}`;
  const marcado = feitos.has(topicId);

  return (
    <div className="flex flex-col items-start gap-1 sm:items-end">
      <label
        className={`inline-flex cursor-pointer items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
          marcado
            ? "border-success/40 bg-success/10 text-success-active dark:text-success-hover"
            : "border-border text-muted hover:text-foreground"
        } ${pendentes.has(chave) ? "opacity-70" : ""}`}
      >
        <input
          type="checkbox"
          checked={marcado}
          onChange={(e) => marcar(chave, [topicId], e.target.checked)}
          aria-label={`Marcar "${titulo}" como concluído`}
          className="h-4 w-4 accent-success"
        />
        {marcado ? "Concluído" : "Marcar como concluído"}
      </label>
      {erros[chave] && (
        <p role="alert" className="text-xs text-red-600 dark:text-red-400">
          {erros[chave]}
        </p>
      )}
    </div>
  );
}
