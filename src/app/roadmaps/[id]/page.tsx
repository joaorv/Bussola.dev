import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { requireLeadAccess } from "@/lib/lead-access";
import {
  LEVEL_LABELS,
  RESOURCE_LABELS,
  countTopics,
  getRoadmap,
  getRoadmaps,
  type TopicLevel,
} from "@/lib/roadmaps";
import { LevelBadge } from "@/components/roadmap/LevelBadge";
import { TopicoCheck } from "@/components/roadmap/TopicoCheck";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { resumirProgresso } from "@/lib/progresso";

export function generateStaticParams() {
  return getRoadmaps().map((roadmap) => ({ id: roadmap.id }));
}

export async function generateMetadata({
  params,
}: PageProps<"/roadmaps/[id]">): Promise<Metadata> {
  const { id } = await params;
  const roadmap = getRoadmap(id);

  return roadmap
    ? { title: `${roadmap.title} | Bússola.dev`, description: roadmap.description }
    : {};
}

const LEVELS = Object.keys(LEVEL_LABELS) as TopicLevel[];

export default async function RoadmapPage({
  params,
}: PageProps<"/roadmaps/[id]">) {
  await requireLeadAccess();
  const { id } = await params;

  const roadmap = getRoadmap(id);

  if (!roadmap) {
    notFound();
  }

  // Quem tem conta marca o progresso; quem só fez o pré-cadastro vê a trilha
  // sem os checks.
  const userId = (await getSession())?.user?.id;
  const concluidos = userId
    ? await prisma.progressoTopico.findMany({
        where: { userId, roadmapId: roadmap.id },
        select: { topicId: true, concluidoEm: true },
      })
    : [];
  const feitos = new Set(concluidos.map((c) => c.topicId));
  const progresso = resumirProgresso(roadmap, concluidos);
  const etapaCompleta = new Set(
    progresso.etapas.filter((e) => e.total > 0 && e.concluidos === e.total).map((e) => e.id)
  );

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
            {roadmap.title}
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">{roadmap.description}</p>
          <p className="mt-4 text-sm text-white/50">
            {roadmap.categories.length} etapas · {countTopics(roadmap)} tópicos
          </p>

          {userId ? (
            <div className="mt-6 max-w-md">
              <div className="flex items-baseline justify-between text-sm">
                <span className="text-white/70">Seu progresso</span>
                <span className="tabular-nums text-white">
                  {progresso.concluidos}/{progresso.total} · {progresso.percentual}%
                </span>
              </div>
              <div
                role="progressbar"
                aria-label="Seu progresso nesta trilha"
                aria-valuemin={0}
                aria-valuemax={progresso.total}
                aria-valuenow={progresso.concluidos}
                className="mt-2 h-2 overflow-hidden rounded-full bg-night-line"
              >
                <div
                  className="h-full rounded-full bg-success"
                  style={{ width: `${progresso.percentual}%` }}
                />
              </div>
            </div>
          ) : (
            <p className="mt-6 text-sm text-white/70">
              <Link
                href={`/login?callbackUrl=${encodeURIComponent(`/roadmaps/${roadmap.id}`)}`}
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
              {roadmap.categories.map((category) => (
                <li key={category.id}>
                  <a
                    href={`#${category.id}`}
                    className="flex items-start justify-between gap-2 transition-colors hover:text-foreground"
                  >
                    <span>
                      {category.order}. {category.name}
                    </span>
                    {etapaCompleta.has(category.id) && (
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
          {roadmap.categories.map((category, index) => (
            <li
              key={category.id}
              id={category.id}
              className="relative scroll-mt-6 pb-12 pl-12 last:pb-0"
            >
              {/* trilha ligando as etapas */}
              {index < roadmap.categories.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-9 bottom-0 left-4 w-px bg-border"
                />
              ) : null}
              <span
                aria-hidden="true"
                className={`absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold text-white ${
                  etapaCompleta.has(category.id) ? "bg-success" : "bg-brand"
                }`}
              >
                {etapaCompleta.has(category.id) ? "✓" : category.order}
              </span>

              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                  {category.name}
                </h2>
                {userId && (
                  <p
                    className={`text-sm tabular-nums ${
                      etapaCompleta.has(category.id)
                        ? "font-medium text-success-active dark:text-success-hover"
                        : "text-muted"
                    }`}
                  >
                    {etapaCompleta.has(category.id)
                      ? "Etapa concluída"
                      : `${progresso.etapas[index].concluidos}/${progresso.etapas[index].total} concluídos`}
                  </p>
                )}
              </div>

              <ol className="mt-6 flex flex-col gap-4">
                {category.topics.map((topic) => (
                  <li
                    key={topic.id}
                    className={`rounded-lg border bg-surface p-card ${
                      feitos.has(topic.id) ? "border-success/40" : "border-border"
                    }`}
                  >
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h3 className="text-base font-semibold text-foreground">
                        {topic.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <LevelBadge level={topic.level} />
                        {userId && (
                          <TopicoCheck
                            roadmapId={roadmap.id}
                            topicId={topic.id}
                            titulo={topic.title}
                            concluido={feitos.has(topic.id)}
                          />
                        )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-(--color-ink-700)">
                      {topic.description}
                    </p>
                    <ul className="mt-4 flex flex-wrap gap-2">
                      {topic.resources.map((resource) => (
                        <li
                          key={resource.name}
                          className="rounded-md bg-ink-100 px-2 py-1 text-xs text-foreground"
                        >
                          <span className="text-muted">
                            {RESOURCE_LABELS[resource.type]}:
                          </span>{" "}
                          {resource.name}
                        </li>
                      ))}
                    </ul>
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
