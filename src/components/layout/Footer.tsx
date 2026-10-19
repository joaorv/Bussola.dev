"use client";

import Link from "next/link";
import { CompassIcon } from "./CompassIcon";
import { scrollToAnchor, scrollToTop } from "@/lib/scroll";
import { PRIVACY_POLICY_HREF, TERMS_OF_USE_HREF } from "@/lib/legal";

const LEGAL_LINKS = [
  { href: PRIVACY_POLICY_HREF, label: "Política de Privacidade" },
  { href: TERMS_OF_USE_HREF, label: "Termos de Uso" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto w-full max-w-6xl px-gutter py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/"
            onClick={scrollToTop}
            className="flex items-center gap-2 text-sm font-semibold text-foreground"
          >
            <CompassIcon className="h-5 w-5 text-brand" />
            Bússola.dev
          </Link>

          <nav
            aria-label="Rodapé"
            className="flex flex-wrap items-center gap-6 text-sm text-muted"
          >
            <Link
              href="/#como-funciona"
              onClick={(e) => scrollToAnchor(e, "como-funciona")}
              className="transition-colors hover:text-foreground"
            >
              Como funciona
            </Link>
            <Link
              href="/#lista-de-espera"
              onClick={(e) => scrollToAnchor(e, "lista-de-espera")}
              className="transition-colors hover:text-foreground"
            >
              Lista de espera
            </Link>
          </nav>
        </div>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted">
            © {year} Bússola.dev. Todos os direitos reservados.
          </p>

          <nav
            aria-label="Documentos legais"
            className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted"
          >
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="underline underline-offset-2 transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
