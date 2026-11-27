"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { CompassIcon } from "./CompassIcon";
import { iniciais } from "@/components/perfil/Avatar";
import { scrollToAnchor, scrollToTop } from "@/lib/scroll";

// Visitante: links da landing + "Entrar" + botão "Criar conta".
// Logado: links do app (com a página atual destacada) + menu do usuário.
// "/#..." e não "#...": o cabeçalho aparece em todas as páginas, então o link
// precisa voltar para a home antes de rolar até a seção.
const LINKS_VISITANTE = [{ href: "/#como-funciona", id: "como-funciona", label: "Como funciona" }];
const LINKS_APP = [{ href: "/roadmaps", label: "Roadmaps" }];

const LINKS_USUARIO = [
  { href: "/perfil", label: "Meu perfil" },
  { href: "/perfil/editar", label: "Editar perfil" },
];

function sair() {
  signOut({ callbackUrl: "/" });
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const logado = status === "authenticated";
  const usuario = session?.user;

  const ativo = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-border bg-surface/90 backdrop-blur">
      <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-between px-gutter">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold text-foreground"
          onClick={(e) => {
            scrollToTop(e);
            setOpen(false);
          }}
        >
          <CompassIcon className="h-6 w-6 text-brand" />
          Bússola.dev
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          {/* enquanto a sessão carrega, não mostra nada: evita piscar
              "Criar conta" para quem já está logado */}
          {status === "loading" ? (
            <span aria-hidden="true" className="h-9 w-9" />
          ) : logado ? (
            <>
              <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
                {LINKS_APP.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={ativo(link.href) ? "page" : undefined}
                    className={`transition-colors ${
                      ativo(link.href) ? "text-foreground" : "text-muted hover:text-foreground"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="hidden sm:block">
                <MenuUsuario nome={usuario?.name ?? ""} email={usuario?.email ?? ""} />
              </div>
            </>
          ) : (
            <>
              <nav className="hidden items-center gap-6 text-sm font-medium text-muted sm:flex">
                {LINKS_VISITANTE.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={(e) => scrollToAnchor(e, link.id)}
                    className="transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link href="/login" className="transition-colors hover:text-foreground">
                  Entrar
                </Link>
              </nav>
              <Link
                href="/cadastro"
                onClick={() => setOpen(false)}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover active:bg-accent-active"
              >
                Criar conta
              </Link>
            </>
          )}

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

      {/* absoluto, sobre o conteúdo: se ocupasse espaço no fluxo, fechar o menu
          no clique encolheria o cabeçalho e a seção de destino subiria para
          baixo dele. */}
      {open ? (
        <nav
          id="mobile-nav"
          className="absolute inset-x-0 top-full border-b border-border bg-surface px-gutter py-4 shadow-lg shadow-black/5 sm:hidden"
        >
          {logado ? (
            <>
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <FotoUsuario nome={usuario?.name ?? ""} />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{usuario?.name}</p>
                  <p className="truncate text-xs text-muted">{usuario?.email}</p>
                </div>
              </div>
              <ul className="mt-4 flex flex-col gap-4 text-sm font-medium text-muted">
                {[...LINKS_APP, ...LINKS_USUARIO].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={ativo(link.href) ? "page" : undefined}
                      className={`block transition-colors ${
                        ativo(link.href) ? "text-foreground" : "hover:text-foreground"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li className="border-t border-border pt-4">
                  <button
                    type="button"
                    onClick={sair}
                    className="block transition-colors hover:text-foreground"
                  >
                    Sair
                  </button>
                </li>
              </ul>
            </>
          ) : (
            <ul className="flex flex-col gap-4 text-sm font-medium text-muted">
              {LINKS_VISITANTE.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={(e) => {
                      scrollToAnchor(e, link.id);
                      setOpen(false);
                    }}
                    className="block transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block transition-colors hover:text-foreground"
                >
                  Entrar
                </Link>
              </li>
            </ul>
          )}
        </nav>
      ) : null}
    </header>
  );
}

// Foto do perfil; sem foto (a rota responde 404) mostra as iniciais. A sessão
// não guarda a versão da foto, então a URL vai sem ?v= e o navegador sempre
// confere se mudou.
function FotoUsuario({ nome }: { nome: string }) {
  const [semFoto, setSemFoto] = useState(false);
  const classe = "h-9 w-9 shrink-0 rounded-full";

  if (semFoto) {
    return (
      <span
        aria-hidden="true"
        className={`${classe} flex items-center justify-center bg-brand text-xs font-semibold text-white`}
      >
        {iniciais(nome) || "?"}
      </span>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/api/perfil/foto"
      alt=""
      onError={() => setSemFoto(true)}
      className={`${classe} bg-ink-100 object-cover`}
    />
  );
}

// Avatar que abre um menu com nome, e-mail, links do perfil e "Sair". Fecha ao
// clicar fora, com Esc (devolvendo o foco ao botão) e ao escolher um item.
function MenuUsuario({ nome, email }: { nome: string; email: string }) {
  const [aberto, setAberto] = useState(false);
  const raiz = useRef<HTMLDivElement>(null);
  const botao = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!aberto) return;

    function cliqueFora(e: MouseEvent) {
      if (!raiz.current?.contains(e.target as Node)) setAberto(false);
    }
    function tecla(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setAberto(false);
        botao.current?.focus();
      }
    }

    document.addEventListener("mousedown", cliqueFora);
    document.addEventListener("keydown", tecla);
    return () => {
      document.removeEventListener("mousedown", cliqueFora);
      document.removeEventListener("keydown", tecla);
    };
  }, [aberto]);

  return (
    <div ref={raiz} className="relative">
      <button
        ref={botao}
        type="button"
        onClick={() => setAberto((v) => !v)}
        aria-expanded={aberto}
        aria-controls="menu-usuario"
        className="flex items-center gap-1.5 rounded-full p-0.5 text-muted transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
      >
        <span className="sr-only">Menu da conta</span>
        <FotoUsuario nome={nome} />
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className={`h-4 w-4 transition-transform ${aberto ? "rotate-180" : ""}`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {aberto ? (
        <div
          id="menu-usuario"
          className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-lg border border-border bg-surface shadow-lg shadow-black/10"
        >
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-semibold text-foreground">{nome}</p>
            <p className="truncate text-xs text-muted">{email}</p>
          </div>
          <ul className="py-1 text-sm">
            {LINKS_USUARIO.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setAberto(false)}
                  className="block px-4 py-2 text-foreground transition-colors hover:bg-ink-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="border-t border-border py-1 text-sm">
            <button
              type="button"
              onClick={sair}
              className="block w-full px-4 py-2 text-left text-muted transition-colors hover:bg-ink-100 hover:text-foreground"
            >
              Sair
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
