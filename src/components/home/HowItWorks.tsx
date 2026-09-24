const STEPS = [
  {
    title: "Siga um roadmap claro",
    description:
      "A trilha de Desenvolvimento Web abre em etapas, na ordem certa de estudo. Cada etapa concluída fica salva no seu perfil — você vê o quanto já andou.",
  },
  {
    title: "Descubra o que existe na sua região",
    description:
      "Em cada etapa aparecem cursos, empresas que contratam e eventos de tecnologia perto de você: o elo entre saber o que estudar e saber onde aplicar.",
  },
  {
    title: "Encontre sua comunidade",
    description:
      "Grupos, meetups e comunidades locais ligados às etapas da trilha, para você estudar acompanhado em vez de navegar sozinho.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="como-funciona"
      className="relative isolate scroll-mt-16 overflow-hidden bg-background py-section-sm lg:py-section"
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
        <h2 className="max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
          Como funciona a Bússola.dev
        </h2>

        <ol className="relative mt-12 flex flex-col gap-8 lg:mt-16 lg:gap-10">
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
                  className={`col-start-2 row-start-1 min-w-0 rounded-lg border border-border bg-surface p-card shadow-lg shadow-night/5 ${
                    onTheLeft ? "lg:col-start-1" : "lg:col-start-3"
                  }`}
                >
                  <h3 className="text-base font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted">
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>

        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
          Todo o conteúdo regional é curado manualmente pela equipe no MVP — sem
          depender de cadastro de terceiros.
        </p>
      </div>
    </section>
  );
}
