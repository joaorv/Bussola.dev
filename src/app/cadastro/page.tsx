import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { CompassIcon } from "@/components/layout/CompassIcon";

export const metadata: Metadata = {
  title: "Criar conta | Bússola.dev",
  description: "Crie sua conta na plataforma Bússola.dev.",
};

export default function CadastroPage() {
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
            <h1 className="text-xl font-semibold text-foreground">Crie sua conta</h1>
            <p className="mt-1 text-xs text-muted">Comece a montar sua trilha</p>
          </div>

          <Suspense fallback={null}>
            <RegisterForm />
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
