import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL_CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/legal";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

type LegalPageProps = {
  title: string;
  intro: ReactNode;
  sections: LegalSection[];
  related: { href: string; label: string };
};

// UTC fixo: sem ele, a data poderia aparecer como o dia anterior dependendo do
// fuso do servidor.
const lastUpdated = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "long",
  timeZone: "UTC",
}).format(new Date(`${LEGAL_LAST_UPDATED}T00:00:00Z`));

// Texto corrido dos documentos. Usa ink-700 em vez de muted porque são blocos
// longos de leitura e precisam de mais contraste.
const BODY_CLASS =
  "flex flex-col gap-4 text-base leading-7 text-(--color-ink-700) [&_a]:font-medium [&_a]:text-brand [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-brand-hover [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5";

export function LegalPage({ title, intro, sections, related }: LegalPageProps) {
  return (
    <>
      <section
        aria-labelledby="legal-title"
        className="bg-night px-gutter py-section-sm text-white"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Documentos legais
          </p>
          <h1
            id="legal-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h1>
          <p className="mt-4 text-sm text-white/70">
            Última atualização:{" "}
            <time dateTime={LEGAL_LAST_UPDATED}>{lastUpdated}</time>
          </p>
        </div>
      </section>

      <div className="mx-auto grid w-full max-w-6xl gap-10 px-gutter py-section-sm lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16 lg:py-section">
        {/* sumário: no topo no mobile, fixo na lateral no desktop */}
        <nav
          aria-labelledby="legal-toc-title"
          className="lg:sticky lg:top-24 lg:self-start"
        >
          <div className="rounded-lg border border-border bg-surface p-card">
            <h2
              id="legal-toc-title"
              className="text-sm font-semibold text-foreground"
            >
              Nesta página
            </h2>
            <ol className="mt-4 flex flex-col gap-2 text-sm text-muted">
              {sections.map((section, index) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="transition-colors hover:text-foreground"
                  >
                    {index + 1}. {section.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </nav>

        <article className="min-w-0 max-w-3xl">
          <div className={BODY_CLASS}>{intro}</div>

          {sections.map((section, index) => (
            <section
              key={section.id}
              id={section.id}
              aria-labelledby={`${section.id}-title`}
              className="mt-10 scroll-mt-6 border-t border-border pt-10"
            >
              <h2
                id={`${section.id}-title`}
                className="text-2xl font-semibold tracking-tight text-foreground"
              >
                <span className="text-accent">{index + 1}.</span>{" "}
                {section.title}
              </h2>
              <div className={`mt-4 ${BODY_CLASS}`}>{section.content}</div>
            </section>
          ))}

          <div className="mt-section-sm flex flex-col gap-3 rounded-lg border border-border bg-surface p-card sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted">Veja também</p>
            <Link
              href={related.href}
              className="text-sm font-medium text-brand underline underline-offset-2 transition-colors hover:text-brand-hover"
            >
              {related.label}
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}

// Forma de contato usada no fim dos dois documentos.
export function LegalContact() {
  return LEGAL_CONTACT_EMAIL ? (
    <a href={`mailto:${LEGAL_CONTACT_EMAIL}`}>{LEGAL_CONTACT_EMAIL}</a>
  ) : (
    <>os canais oficiais de atendimento da Bússola.dev</>
  );
}
