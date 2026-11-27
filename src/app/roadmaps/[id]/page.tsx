import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireLeadAccess } from "@/lib/lead-access";
import { LEVEL_LABELS, getRoadmaps, type TopicLevel } from "@/lib/roadmaps";
import {
  NIVEL_PARA_LEVEL,
  RECURSO_LABELS,
  buscarRoadmap,
  carregarTrilha,
} from "@/lib/trilha";
import { LevelBadge } from "@/components/roadmap/LevelBadge";
import { TopicoCheck } from "@/components/roadmap/TopicoCheck";
import { getSession } from "@/lib/auth";

export function generateStaticParams() {
  return getRoadmaps().map((roadmap) => ({ id: roadmap.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/roadmaps/[id]">): Promise<Metadata> {
  const { id } = await params;
  const roadmap = await buscarRoadmap(id);

  return roadmap
    ? { title: `${roadmap.titulo} | Bússola.dev`, description: roadmap.descricao }
    : {};
}

const LEVELS = Object.keys(LEVEL_LABELS) as TopicLevel[];

export default async function RoadmapPage({
  params,
}: PageProps<"/roadmaps/[id]">) {
  const { id } = await params;
  await requireLeadAccess(`/roadmaps/${id}`);

  // Quem tem conta marca o progresso; quem só fez o pré-cadastro vê a trilha
  // sem os checks. Os dados são os mesmos de GET /api/roadmaps/[id]/etapas.
  const userId = (await getSession())?.user?.id ?? null;
  const trilha = await carregarTrilha(id, userId);

  if (!trilha) {
    notFound();
  }

  return (
    <>
      <section
        aria-labelledby="roadmap-title"
        className="bg-night px-gutter py-section-sm text-white"
      >
        <div className="mx-auto w-full max-w-6xl">
          <Link
            href="/roadmaps"
            className="text-sm text-white/70 transition-colors hover:text-white"
          >
            ← Todos os roadmaps
          </Link>
          <h1
            id="roadmap-title"
            className="mt-4 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {trilha.titulo}
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">{trilha.descricao}</p>
          <p className="mt-4 text-sm text-white/50">
            {trilha.etapas.length} etapas · {trilha.totalTopicos} tópicos
          </p>

          {userId ? (
            <div className="mt-6 max-w-md">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-white/70">Seu progresso</span>
                <span className="tabular-nums text-white">
                  {trilha.topicosConcluidos}/{trilha.totalTopicos} · {trilha.percentual}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Seu progresso nesta trilha"
                aria-valuemin={0}
                aria-valuemax={trilha.totalTopicos}
                aria-valuenow={trilha.topicosConcluidos}
                className="mt-2 h-2 overflow-hidden rounded-full bg-night-line"
              >
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${trilha.percentual}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-white/70">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(`/roadmaps/${trilha.roadmapId}`)}`}
                className="font-medium text-white underline underline-offset-2 hover:text-accent-hover"
              >
                Entre na sua conta
              </Link>{" "}
              para marcar os tópicos que já concluiu.
            </p>
          )}
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-gutter py-section-sm lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-section">
        {/* sumário: no topo no mobile, fixo na lateral no desktop */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <nav
            aria-labelledby="roadmap-toc-title"
            className="rounded-lg border border-border bg-surface p-card"
          >
            <h2
              id="roadmap-toc-title"
              className="text-sm font-semibold text-foreground"
            >
              Etapas
            </h2>
            <ol className="mt-4 flex flex-col gap-2 text-sm text-muted">
              {trilha.etapas.map((etapa) => (
                <li key={etapa.id}>
                  <a
                    href={`#${etapa.id}`}
                    className="flex items-start justify-between gap-2 transition-colors hover:text-foreground"
                  >
                    <span>
                      {etapa.ordem}. {etapa.nome}
                    </span>
                    {etapa.concluida && (
                      <span className="text-success" aria-label="Etapa concluída">
                        ✓
                      </span>
                    )}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="rounded-lg border border-border bg-surface p-card">
            <h2 className="text-sm font-semibold text-foreground">Legenda</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {LEVELS.map((level) => (
                <li key={level}>
                  <LevelBadge level={level} />
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <ol className="min-w-0">
          {trilha.etapas.map((etapa, index) => (
            <li
              key={etapa.id}
              id={etapa.id}
              className="relative scroll-mt-6 pb-12 pl-12 last:pb-0"
            >
              {/* trilha ligando as etapas */}
              {index < trilha.etapas.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-9 bottom-0 left-4 w-px bg-border"
                />
              ) : null}
              <span
                aria-hidden="true"
                className={`absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${
                  etapa.concluida ? "bg-success" : "bg-brand"
                }`}
              >
                {etapa.concluida ? "✓" : etapa.ordem}
              </span>

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {etapa.nome}
                </h2>
                {userId && (
                  <p
                    className={`text-sm tabular-nums ${
                      etapa.concluida
                        ? "font-medium text-success-active dark:text-success-hover"
                        : "text-muted"
                    }`}
                  >
                    {etapa.concluida
                      ? "Etapa concluída"
                      : `${etapa.topicosConcluidos}/${etapa.totalTopicos} concluídos`}
                  </p>
                )}
              </div>

              <ol className="mt-6 flex flex-col gap-4">
                {etapa.topicos.map((topico) => (
                  <li
                    key={topico.id}
                    className={`rounded-lg border bg-surface p-card ${
                      topico.concluido ? "border-success/40" : "border-border"
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h3 className="text-base font-semibold text-foreground">
                        {topico.titulo}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <LevelBadge level={NIVEL_PARA_LEVEL[topico.nivel]} />
                        {userId && (
                          <TopicoCheck
                            roadmapId={trilha.roadmapId}
                            topicId={topico.id}
                            titulo={topico.titulo}
                            concluido={topico.concluido}
                          />
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-(--color-ink-700)">
                      {topico.descricao}
                    </p>
                    {topico.recursos.length > 0 && (
                      <ul className="mt-4 flex flex-wrap gap-2">
                        {topico.recursos.map((recurso) => (
                          <li
                            key={recurso.nome}
                            className="rounded-md bg-ink-100 px-2 py-1 text-xs text-foreground"
                          >
                            <span className="text-muted">
                              {RECURSO_LABELS[recurso.tipo]}:
                            </span>{" "}
                            {recurso.nome}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      </div>
    </>
  );
}
