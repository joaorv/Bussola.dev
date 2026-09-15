import Link from "next/link";
import { CompassIcon } from "./CompassIcon";

const NAV_LINKS = [
  { href: "/trilhas", label: "Trilhas" },
  { href: "/sobre", label: "Sobre" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-gutter">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground"
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

        <Link
          href="/login"
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
