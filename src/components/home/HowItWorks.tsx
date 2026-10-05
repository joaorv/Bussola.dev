import Link from "next/link";
import { CompassIcon } from "@/components/layout/CompassIcon";

const SEM_BUSSOLA = [
  "Dezenas de roadmaps genéricos, cada um mandando estudar uma coisa diferente",
  "Cursos escolhidos no chute, sem saber se valem o seu tempo",
  "Nenhuma ideia de quais empresas contratam na sua cidade",
  "Estudo solitário, sem ninguém por perto para trocar experiência",
];

const COM_BUSSOLA = [
  "Uma trilha só, dividida em etapas, na ordem certa de estudo",
  "Cursos da sua região ligados a cada etapa da trilha",
  "Empresas que contratam e eventos de tecnologia perto de você",
  "Comunidades locais para estudar acompanhado",
];

const STEPS = [
  {
    title: "Siga um roadmap claro",
    description:
      "A trilha de Desenvolvimento Web abre em etapas, na ordem certa de estudo. Cada etapa concluída fica salva no seu perfil — você vê o quanto já andou.",
    tags: ["Etapas em ordem", "Progresso salvo no perfil"],
    icon: (
      <>
        <path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2Z" strokeLinejoin="round" />
        <path d="M9 4v14M15 6v14" />
      </>
    ),
  },
  {
    title: "Descubra o que existe na sua região",
    description:
      "Em cada etapa aparecem cursos, empresas que contratam e eventos de tecnologia perto de você: o elo entre saber o que estudar e saber onde aplicar.",
    tags: ["Cursos", "Empresas que contratam", "Eventos"],
    icon: (
      <>
        <path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11Z" strokeLinejoin="round" />
        <circle cx="12" cy="10" r="2.5" />
      </>
    ),
  },
  {
    title: "Encontre sua comunidade",
    description:
      "Grupos, meetups e comunidades locais ligados às etapas da trilha, para você estudar acompanhado em vez de navegar sozinho.",
    tags: ["Meetups", "Grupos de estudo", "Comunidades locais"],
    icon: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3 20a6 6 0 0 1 12 0M16 5a3 3 0 0 1 0 6M18 14.5a6 6 0 0 1 3 5.5" strokeLinecap="round" />
      </>
    ),
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative isolate overflow-hidden bg-background py-section-sm lg:py-section"
    >
      {/* curvas de nível, como as de uma carta náutica */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 520"
        preserveAspectRatio="none"
        fill="none"
        stroke="currentColor"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-border/50"
      >
        <path d="M-40 118C220 58 420 178 700 148s420-128 800-48" vectorEffect="non-scaling-stroke" />
        <path d="M-40 236C240 176 440 296 720 266s420-128 800-48" vectorEffect="non-scaling-stroke" />
        <path d="M-40 354C260 294 460 414 740 384s420-128 800-48" vectorEffect="non-scaling-stroke" />
      </svg>

      <div className="mx-auto w-full max-w-6xl px-gutter">
        <p className="text-sm font-semibold uppercase tracking-wider text-accent">
          Como funciona
        </p>
        <h2 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Pare de estudar no escuro. Siga um caminho que leva a algum lugar.
        </h2>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          A Bússola.dev junta em um só lugar o que você precisa estudar e onde
          aplicar isso na sua cidade.
        </p>

        {/* antes e depois: o problema que o lead já sente, lado a lado com a solução */}
        <div className="mt-12 grid gap-6 lg:mt-16 lg:grid-cols-2">
          <div className="rounded-lg border border-border bg-surface p-card">
            <h3 className="text-base font-semibold text-foreground">
              Sem a Bússola
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {SEM_BUSSOLA.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-muted">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-500"
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                      <path d="M6 6l8 8M14 6l-8 8" strokeLinecap="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-accent/40 bg-night p-card text-white shadow-lg shadow-night/20">
            <h3 className="flex items-center gap-2 text-base font-semibold">
              <CompassIcon className="h-5 w-5 text-accent" />
              Com a Bússola.dev
            </h3>
            <ul className="mt-5 flex flex-col gap-4">
              {COM_BUSSOLA.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-white/80">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-success-hover"
                  >
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth={2} className="h-3 w-3">
                      <path d="M4.5 10.5l3.5 3.5 7.5-8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <h3 className="mt-section-sm text-2xl font-semibold tracking-tight lg:mt-section">
          Três passos, do primeiro estudo à primeira oportunidade
        </h3>

        <ol className="relative mt-10 flex flex-col gap-8 lg:mt-12 lg:gap-10">
          {/* trilha que costura as etapas: à esquerda no mobile, ao centro no desktop */}
          <div
            aria-hidden="true"
            className="absolute inset-y-0 left-[1.125rem] border-l border-dashed border-border lg:left-1/2 lg:-translate-x-1/2"
          />

          {STEPS.map((step, index) => {
            const onTheLeft = index % 2 === 0;

            return (
              <li
                key={step.title}
                className="grid grid-cols-[2.25rem_1fr] items-center gap-5 lg:grid-cols-[1fr_2.25rem_1fr] lg:gap-10"
              >
                {/* alfinete de mapa: círculo girado 45°, com a ponta para baixo */}
                <span
                  aria-hidden="true"
                  className="col-start-1 row-start-1 flex h-9 w-9 rotate-45 items-center justify-center rounded-full rounded-bl-none bg-accent shadow-lg shadow-accent/20 lg:col-start-2"
                >
                  <span className="-rotate-45 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                </span>

                <div
                  className={`col-start-2 row-start-1 min-w-0 rounded-lg border border-border bg-surface p-card shadow-lg shadow-night/5 transition-shadow hover:shadow-night/10 ${
                    onTheLeft ? "lg:col-start-1" : "lg:col-start-3"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="h-5 w-5">
                      {step.icon}
                    </svg>
                  </span>
                  <h4 className="mt-4 text-base font-semibold text-foreground">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="relative isolate mt-section-sm overflow-hidden rounded-lg border border-night-line bg-night p-8 text-white sm:p-10 lg:mt-section">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_80%_at_90%_10%,rgba(78,127,203,0.25),transparent_70%)]"
          />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="text-2xl font-semibold tracking-tight text-balance">
                Seja dos primeiros a usar a Bússola.dev
              </h3>
              <p className="mt-3 text-white/70">
                Entre na lista de espera e acompanhe de perto o lançamento da
                trilha de Desenvolvimento Web.
              </p>
            </div>
            <Link
              href="#lista-de-espera"
              className="inline-flex h-12 shrink-0 items-center justify-center rounded-md bg-accent px-7 text-base font-medium text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover active:bg-accent-active"
            >
              Entrar na lista de espera
            </Link>
          </div>
          <p className="mt-8 border-t border-night-line pt-6 text-sm text-white/60">
            Todo o conteúdo regional é selecionado manualmente pela nossa
            equipe, sem depender de cadastro de terceiros.
          </p>
        </div>
      </div>
    </section>
  );
}
