"use client";

import { useState } from "react";
import Link from "next/link";
import { CompassIcon } from "./CompassIcon";

const NAV_LINKS = [
  { href: "/trilhas", label: "Trilhas" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-gutter">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground"
          onClick={() => setOpen(false)}
        >
          <CompassIcon className="h-6 w-6 text-brand" />
          Bússola.dev
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-muted sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Entrar
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md text-foreground transition-colors hover:bg-ink-100 sm:hidden"
          >
            <span className="sr-only">
              {open ? "Fechar menu" : "Abrir menu"}
            </span>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              strokeLinecap="round"
              aria-hidden="true"
              className="h-5 w-5"
            >
              {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="mobile-nav"
          className="border-t border-border px-gutter py-4 sm:hidden"
        >
          <ul className="flex flex-col gap-4 text-sm font-medium text-muted">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
