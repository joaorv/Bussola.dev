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
  type EtapaTrilha,
} from "@/lib/trilha";
import { LevelBadge } from "@/components/roadmap/LevelBadge";
import {
  CardTopico,
  ChecklistEtapa,
  ContadorEtapa,
  MarcadorEtapa,
  ProgressoGeral,
  SeloEtapaSumario,
  TopicoCheck,
  TrilhaProgressoProvider,
} from "@/components/roadmap/TrilhaProgresso";
import { PertoDeVoce } from "@/components/regional/PertoDeVoce";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buscarConteudoRegional } from "@/lib/conteudo-regional";
import { formatarLocal } from "@/lib/regioes";

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

const idsDaEtapa = (etapa: EtapaTrilha) => etapa.topicos.map((t) => t.id);

export default async function RoadmapPage({
  params,
}: PageProps<"/roadmaps/[id]">) {
  const { id } = await params;
  await requireLeadAccess(`/roadmaps/${id}`);

  // Quem tem conta marca o progresso; quem só fez o pré-cadastro vê a trilha
  // sem os checks. Os dados são os mesmos de GET /api/roadmaps/[id]/etapas.
  const userId = (await getSession())?.user?.id ?? null;
  const [trilha, regiao] = await Promise.all([
    carregarTrilha(id, userId),
    userId
      ? prisma.user.findUnique({ where: { id: userId }, select: { estado: true, cidade: true } })
      : null,
  ]);

  if (!trilha) {
    notFound();
  }

  const estado = regiao?.estado ?? null;
  const cidade = regiao?.cidade ?? null;
  const conteudosRegionais = await buscarConteudoRegional({
    estado,
    cidade,
    roadmapId: trilha.roadmapId,
    limite: 9,
  });

  const todosOsTopicos = trilha.etapas.flatMap(idsDaEtapa);
  const concluidos = trilha.etapas.flatMap((etapa) =>
    etapa.topicos.filter((t) => t.concluido).map((t) => t.id)
  );

  return (
    <TrilhaProgressoProvider roadmapId={trilha.roadmapId} concluidos={concluidos}>
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
            <ProgressoGeral topicIds={todosOsTopicos} />
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
                    <SeloEtapaSumario topicIds={idsDaEtapa(etapa)} />
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
          {trilha.etapas.map((etapa, index) => {
            const cards = (
              <ol className="mt-4 flex flex-col gap-4">
                {etapa.topicos.map((topico) => (
                  <CardTopico key={topico.id} topicId={topico.id}>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <h3 className="text-base font-semibold text-foreground">
                        {topico.titulo}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <LevelBadge level={NIVEL_PARA_LEVEL[topico.nivel]} />
                        {userId && <TopicoCheck topicId={topico.id} titulo={topico.titulo} />}
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
                  </CardTopico>
                ))}
              </ol>
            );

            return (
              <li
                key={etapa.id}
                id={etapa.id}
                className="relative scroll-mt-24 pb-12 pl-12 last:pb-0"
              >
                {/* trilha ligando as etapas */}
                {index < trilha.etapas.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-9 bottom-0 left-4 w-px bg-border"
                  />
                ) : null}
                <MarcadorEtapa ordem={etapa.ordem} topicIds={idsDaEtapa(etapa)} />

                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    {etapa.nome}
                  </h2>
                  {userId && <ContadorEtapa topicIds={idsDaEtapa(etapa)} />}
                </div>

                {userId ? (
                  <>
                    <ChecklistEtapa
                      etapaId={etapa.id}
                      etapaNome={etapa.nome}
                      topicos={etapa.topicos.map((t) => ({
                        id: t.id,
                        titulo: t.titulo,
                        level: NIVEL_PARA_LEVEL[t.nivel],
                      }))}
                    />
                    {/* descrições e recursos ficam recolhidos: o checklist já
                        mostra os tópicos e dá para marcar por ele */}
                    <details className="group mt-4">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-1.5 text-sm font-medium text-brand transition-colors hover:text-foreground [&::-webkit-details-marker]:hidden">
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform group-open:rotate-90"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.21 14.77a.75.75 0 01.02-1.06L11.17 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="group-open:hidden">Ver detalhes dos tópicos</span>
                        <span className="hidden group-open:inline">Ocultar detalhes</span>
                      </summary>
                      {cards}
                    </details>
                  </>
                ) : (
                  <div className="mt-2">{cards}</div>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <PertoDeVoce
        conteudos={conteudosRegionais}
        local={estado ? formatarLocal(cidade, estado) : null}
        logado={!!userId}
        callbackUrl={`/roadmaps/${trilha.roadmapId}`}
      />
    </TrilhaProgressoProvider>
  );
}
