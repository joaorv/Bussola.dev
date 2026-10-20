"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() =>
    searchParams.get("error") === "CredentialsSignin"
      ? "E-mail ou senha incorretos."
      : null
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const data = new FormData(e.currentTarget);
    const email = (data.get("email") as string).trim();
    const password = data.get("password") as string;

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        setError("E-mail ou senha incorretos.");
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="seu@email.com"
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="block text-sm font-medium text-foreground">
            Senha
          </label>
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-xs text-muted hover:text-foreground"
          >
            {showPassword ? "Ocultar" : "Mostrar"}
          </button>
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="mt-1.5 w-full rounded-md border border-border bg-surface px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-10 w-full rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-xs text-muted">
        Ainda não tem acesso?{" "}
        <Link href="/#lista-de-espera" className="text-brand hover:underline">
          Entrar na lista de espera
        </Link>
      </p>
    </form>
  );
}
