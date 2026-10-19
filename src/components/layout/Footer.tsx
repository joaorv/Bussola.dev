"use client";

import Link from "next/link";
import { CompassIcon } from "./CompassIcon";
import { scrollToAnchor, scrollToTop } from "@/lib/scroll";
import { PRIVACY_POLICY_HREF, TERMS_OF_USE_HREF } from "@/lib/legal";

// `anchor` marca os links de seção da home, que rolam suavemente quando o
// usuário já está nela; os demais são páginas comuns.
const FOOTER_LINKS = [
  { href: "/#como-funciona", anchor: "como-funciona", label: "Como funciona" },
  { href: "/#lista-de-espera", anchor: "lista-de-espera", label: "Lista de espera" },
  { href: PRIVACY_POLICY_HREF, label: "Política de Privacidade" },
  { href: TERMS_OF_USE_HREF, label: "Termos de Uso" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-gutter py-10 lg:flex-row lg:items-center lg:justify-between">
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
          className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted"
        >
          {FOOTER_LINKS.map(({ href, anchor, label }) => (
            <Link
              key={href}
              href={href}
              onClick={anchor ? (e) => scrollToAnchor(e, anchor) : undefined}
              className="transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>

        <p className="text-sm text-muted">
          © {year} Bússola.dev. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
