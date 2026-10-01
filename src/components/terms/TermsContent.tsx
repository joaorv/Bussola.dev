import {
  CURRENT_TERMS_VERSION,
  TERMS_SECTIONS,
  TERMS_UPDATED_AT,
  formatTermsDate,
} from "@/lib/terms";

/** Versão e data da última atualização dos termos. */
export function TermsMeta() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted">
      <span className="rounded-md border border-border bg-surface px-2 py-0.5 font-medium text-foreground">
        Versão {CURRENT_TERMS_VERSION}
      </span>
      <span>
        Última atualização:{" "}
        <time dateTime={TERMS_UPDATED_AT}>
          {formatTermsDate(TERMS_UPDATED_AT)}
        </time>
      </span>
    </div>
  );
}

type TermsContentProps = {
  /** Nível dos títulos das seções: h2 na página, h3 dentro do modal. */
  headingLevel?: "h2" | "h3";
};

/** Texto completo dos Termos de Uso, usado na página /termos e no modal. */
export function TermsContent({ headingLevel = "h2" }: TermsContentProps) {
  const Heading = headingLevel;

  return (
    <div className="flex flex-col gap-8">
      {TERMS_SECTIONS.map((section) => (
        <section key={section.title}>
          <Heading className="text-lg font-semibold text-foreground">
            {section.title}
          </Heading>
          {section.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="mt-3 text-base leading-7 text-foreground/80"
            >
              {paragraph}
            </p>
          ))}
        </section>
      ))}
    </div>
  );
}
