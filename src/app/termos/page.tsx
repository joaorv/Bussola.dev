import type { Metadata } from "next";
import Link from "next/link";
import { TermsContent, TermsMeta } from "@/components/terms/TermsContent";

export const metadata: Metadata = {
  title: "Termos de Uso | Bússola.dev",
  description: "Termos de Uso da plataforma Bússola.dev.",
};

export default function TermosPage() {
  return (
    <div className="px-gutter py-section-sm sm:py-section">
      <article className="mx-auto w-full max-w-3xl">
        <header className="border-b border-border pb-6">
          <h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
            Termos de Uso
          </h1>
          <div className="mt-4">
            <TermsMeta />
          </div>
        </header>

        <div className="py-8">
          <TermsContent />
        </div>

        <p className="rounded-lg border border-border bg-surface p-card text-sm leading-6 text-muted">
          A aceitação destes termos é registrada quando você{" "}
          <Link
            href="/#lista-de-espera"
            className="font-medium text-brand underline underline-offset-2 transition-colors hover:text-brand-hover"
          >
            entra na lista de espera
          </Link>
          .
        </p>
      </article>
    </div>
  );
}
