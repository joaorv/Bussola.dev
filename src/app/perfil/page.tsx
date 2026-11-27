import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getRoadmap, getRoadmaps } from "@/lib/roadmaps";
import { roadmapIdForAreas } from "@/lib/roadmap-areas";
import { resumirProgresso, type ResumoProgresso } from "@/lib/progresso";
import { LevelBadge } from "@/components/roadmap/LevelBadge";
import { Avatar } from "@/components/perfil/Avatar";
import { fotoUrl, perfilSelect } from "@/lib/perfil";
import { formatarLocal } from "@/lib/regioes";

export const metadata: Metadata = {
  title: "Meu perfil | Bússola.dev",
  description: "Seus dados e o resumo do seu progresso na trilha.",
};

const dataLonga = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

// "https://github.com/fulano/" -> "github.com/fulano", só para exibir.
function semProtocolo(url: string) {
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export default async function PerfilPage() {
  // O proxy já barra quem não está logado; esta checagem garante o mesmo
  // aqui, já que a página lê dados do usuário.
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/perfil");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      ...perfilSelect,
      topicosConcluidos: {
        select: { roadmapId: true, topicId: true, concluidoEm: true },
      },
    },
  });

  // JWT válido de uma conta que não existe mais no banco.
  if (!user) {
    notFound();
  }

  const local = formatarLocal(user.cidade, user.estado);

  // Resumo de cada roadmap em que a pessoa já concluiu algo.
  const resumos = getRoadmaps()
    .map((roadmap) =>
      resumirProgresso(
        roadmap,
        user.topicosConcluidos.filter((t) => t.roadmapId === roadmap.id)
      )
    )
    .filter((r) => r.concluidos > 0)
    .sort(
      (a, b) =>
        (b.ultimaAtividade?.getTime() ?? 0) - (a.ultimaAtividade?.getTime() ?? 0)
    );

  // Trilha em destaque: a última em que houve atividade; sem atividade, a
  // sugerida pelas áreas de interesse.
  const sugerida = roadmapIdForAreas(user.areasInteresse);
  const sugeridaRoadmap = sugerida ? getRoadmap(sugerida) : undefined;
  const principal: ResumoProgresso | null =
    resumos[0] ?? (sugeridaRoadmap ? resumirProgresso(sugeridaRoadmap, []) : null);
  const outras = resumos.slice(1);

  const links = [
    { rotulo: "LinkedIn", url: user.linkedinUrl },
    { rotulo: "GitHub", url: user.githubUrl },
    { rotulo: "Site", url: user.siteUrl },
  ].filter((l): l is { rotulo: string; url: string } => Boolean(l.url));

  return (
    <>
      <section
        aria-labelledby="perfil-title"
        className="bg-night px-gutter py-section-sm text-white"
      >
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar
            nome={user.nome}
            fotoUrl={fotoUrl(user.fotoAtualizadaEm)}
            className="h-20 w-20 bg-night-soft text-2xl ring-1 ring-night-line"
          />
          <div className="min-w-0 flex-1">
            <h1
              id="perfil-title"
              className="text-3xl font-semibold tracking-tight text-balance"
            >
              {user.nome}
            </h1>
            {user.profissao && (
              <p className="mt-1 text-lg text-white/90">{user.profissao}</p>
            )}
            <p className="mt-1 truncate text-white/70">
              {local && <>{local} · </>}
              {user.email}
            </p>
            <p className="mt-1 text-sm text-white/50">
              Membro desde {dataLonga.format(user.createdAt)}
            </p>
          </div>
          <Link
            href="/perfil/editar"
            className="self-start rounded-md border border-night-line bg-night-soft px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-night-line sm:self-center"
          >
            Editar perfil
          </Link>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-gutter py-section-sm lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
        <aside className="flex flex-col gap-6 lg:self-start">
          {user.sobre && (
            <section
              aria-labelledby="sobre-title"
              className="rounded-lg border border-border bg-surface p-card"
            >
              <h2 id="sobre-title" className="text-sm font-semibold text-foreground">
                Sobre
              </h2>
              <p className="mt-3 text-sm leading-6 whitespace-pre-line break-words text-(--color-ink-700)">
                {user.sobre}
              </p>
            </section>
          )}

          {links.length > 0 && (
            <section
              aria-labelledby="links-title"
              className="rounded-lg border border-border bg-surface p-card"
            >
              <h2 id="links-title" className="text-sm font-semibold text-foreground">
                Links
              </h2>
              <ul className="mt-3 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.rotulo} className="min-w-0 text-sm">
                    <span className="text-muted">{link.rotulo}: </span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="break-all text-brand hover:underline"
                    >
                      {semProtocolo(link.url)}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section
            aria-labelledby="areas-title"
            className="rounded-lg border border-border bg-surface p-card"
          >
            <h2 id="areas-title" className="text-sm font-semibold text-foreground">
              Áreas de interesse
            </h2>
            {user.areasInteresse.length > 0 ? (
              <ul className="mt-4 flex flex-wrap gap-2">
                {user.areasInteresse.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-brand/30 bg-brand/10 px-3 py-1 text-xs font-medium text-brand"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-3 text-sm text-muted">
                Você ainda não informou suas áreas de interesse.
              </p>
            )}
          </section>

          {outras.length > 0 && (
            <section
              aria-labelledby="outras-title"
              className="rounded-lg border border-border bg-surface p-card"
            >
              <h2 id="outras-title" className="text-sm font-semibold text-foreground">
                Outras trilhas
              </h2>
              <ul className="mt-4 flex flex-col gap-4">
                {outras.map((r) => (
                  <li key={r.roadmap.id}>
                    <Link
                      href={`/roadmaps/${r.roadmap.id}`}
                      className="text-sm font-medium text-foreground hover:text-brand"
                    >
                      {r.roadmap.title}
                    </Link>
                    <BarraProgresso
                      valor={r.concluidos}
                      total={r.total}
                      rotulo={`Progresso em ${r.roadmap.title}`}
                      className="mt-2"
                    />
                    <p className="mt-1 text-xs text-muted">
                      {r.concluidos} de {r.total} tópicos · {r.percentual}%
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {principal ? (
          <TrilhaPrincipal resumo={principal} sugerida={resumos.length === 0} />
        ) : (
          <section className="flex flex-col items-start rounded-lg border border-dashed border-border bg-surface p-card">
            <h2 className="text-xl font-semibold text-foreground">
              Você ainda não começou uma trilha
            </h2>
            <p className="mt-2 text-sm text-muted">
              Escolha um roadmap para acompanhar seu progresso por aqui.
            </p>
            <Link
              href="/roadmaps"
              className="mt-5 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
            >
              Ver roadmaps
            </Link>
          </section>
        )}
      </div>
    </>
  );
}

function TrilhaPrincipal({
  resumo,
  sugerida,
}: {
  resumo: ResumoProgresso;
  sugerida: boolean;
}) {
  const { roadmap, concluidos, total, percentual, etapas, proximoTopico } = resumo;

  return (
    <section
      aria-labelledby="trilha-title"
      className="rounded-lg border border-border bg-surface p-card"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">
        {sugerida ? "Trilha sugerida para você" : "Sua trilha"}
      </p>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2
          id="trilha-title"
          className="text-2xl font-semibold tracking-tight text-foreground"
        >
          {roadmap.title}
        </h2>
        <Link
          href={`/roadmaps/${roadmap.id}`}
          className="shrink-0 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {sugerida ? "Começar trilha" : "Continuar trilha"}
        </Link>
      </div>

      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-4">
          <p className="text-sm text-muted">
            <span className="text-3xl font-semibold text-foreground tabular-nums">
              {percentual}%
            </span>{" "}
            concluído
          </p>
          <p className="text-sm text-muted tabular-nums">
            {concluidos} de {total} tópicos
          </p>
        </div>
        <BarraProgresso
          valor={concluidos}
          total={total}
          rotulo={`Progresso em ${roadmap.title}`}
          className="mt-3 h-2.5"
        />
      </div>

      {proximoTopico ? (
        <div className="mt-6 rounded-md border border-border bg-ink-100/60 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            Próximo passo · {proximoTopico.etapa}
          </p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <p className="font-semibold text-foreground">{proximoTopico.title}</p>
            <LevelBadge level={proximoTopico.level} />
          </div>
          <p className="mt-1 text-sm leading-6 text-(--color-ink-700)">
            {proximoTopico.description}
          </p>
        </div>
      ) : (
        <p className="mt-6 rounded-md border border-success/30 bg-success/10 p-4 text-sm font-medium text-success-active dark:text-success-hover">
          Trilha concluída! Você completou todos os tópicos.
        </p>
      )}

      <h3 className="mt-8 text-sm font-semibold text-foreground">Etapas</h3>
      <ol className="mt-4 flex flex-col gap-4">
        {etapas.map((etapa, i) => (
          <li key={etapa.id}>
            <div className="flex items-baseline justify-between gap-4 text-sm">
              <span className="text-foreground">
                {i + 1}. {etapa.nome}
              </span>
              <span className="shrink-0 text-xs text-muted tabular-nums">
                {etapa.concluidos}/{etapa.total}
              </span>
            </div>
            <BarraProgresso
              valor={etapa.concluidos}
              total={etapa.total}
              rotulo={`Progresso na etapa ${etapa.nome}`}
              className="mt-2"
            />
          </li>
        ))}
      </ol>
    </section>
  );
}

function BarraProgresso({
  valor,
  total,
  rotulo,
  className = "",
}: {
  valor: number;
  total: number;
  rotulo: string;
  className?: string;
}) {
  const pct = total ? (valor / total) * 100 : 0;

  return (
    <div
      role="progressbar"
      aria-label={rotulo}
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={valor}
      className={`h-1.5 w-full overflow-hidden rounded-full bg-ink-100 ${className}`}
    >
      <div className="h-full rounded-full bg-success" style={{ width: `${pct}%` }} />
    </div>
  );
}
