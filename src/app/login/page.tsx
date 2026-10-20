import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";
import { CompassIcon } from "@/components/layout/CompassIcon";

export const metadata: Metadata = {
  title: "Entrar | Bússola.dev",
  description: "Acesse sua conta na plataforma Bússola.dev.",
};

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-gutter py-12">
      <div className="w-full max-w-sm">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex flex-col items-center text-center">
            <Link
              href="/"
              className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-ink-100"
              aria-label="Página inicial"
            >
              <CompassIcon className="h-6 w-6 text-brand" />
            </Link>
            <h1 className="text-xl font-semibold text-foreground">Acesse sua conta</h1>
            <p className="mt-1 text-xs text-muted">Entre para continuar sua jornada</p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>

        <p className="mt-4 text-center">
          <Link href="/" className="text-xs text-muted hover:text-foreground">
            ← Voltar para o início
          </Link>
        </p>
      </div>
    </div>
  );
}
