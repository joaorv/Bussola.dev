"use client";

import Link from "next/link";
import { CompassIcon } from "./CompassIcon";
import { scrollToAnchor, scrollToTop } from "@/lib/scroll";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-gutter py-10 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          onClick={scrollToTop}
          className="flex items-center gap-2 text-sm font-semibold text-foreground"
        >
          <CompassIcon className="h-5 w-5 text-brand" />
          Bússola.dev
        </Link>

        <nav className="flex flex-wrap items-center gap-6 text-sm text-muted">
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

        <p className="text-sm text-muted">
          © {year} Bússola.dev. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
