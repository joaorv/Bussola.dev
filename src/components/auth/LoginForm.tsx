"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { emailSchema } from "@/lib/lead-validation";
import { SENHA_MAX } from "@/lib/user-validation";
import { safeCallbackUrl } from "@/lib/callback-url";

type Campo = "email" | "password";
type Erros = Partial<Record<Campo, string>>;

const inputBase =
  "mt-1.5 w-full rounded-md border bg-surface px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));

  const [form, setForm] = useState({ email: "", password: "" });
  const [erros, setErros] = useState<Erros>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(() =>
    searchParams.get("error") === "CredentialsSignin"
      ? "E-mail ou senha incorretos."
      : null
  );

  function updateField(field: Campo, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // O erro some assim que a pessoa mexe no campo.
    if (erros[field]) setErros((prev) => ({ ...prev, [field]: undefined }));
  }

  function validar(): Erros {
    const novos: Erros = {};

    if (!form.email.trim()) novos.email = "Digite seu e-mail.";
    else if (!emailSchema.safeParse(form.email).success) novos.email = "Digite um e-mail válido.";

    if (!form.password) novos.password = "Digite sua senha.";

    return novos;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const novosErros = validar();
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      document.getElementById(Object.keys(novosErros)[0])?.focus();
      return;
    }

    setErros({});
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        email: form.email.trim(),
        password: form.password,
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        // Mensagem genérica de propósito: não revela se o e-mail tem conta.
        setError("E-mail ou senha incorretos.");
        setForm((prev) => ({ ...prev, password: "" }));
        document.getElementById("password")?.focus();
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

  function campoErro(field: Campo) {
    const msg = erros[field];
    return msg ? (
      <p id={`${field}-erro`} className="mt-1 text-xs text-red-600 dark:text-red-400">
        {msg}
      </p>
    ) : null;
  }

  function a11y(field: Campo) {
    return {
      "aria-invalid": erros[field] ? true : undefined,
      "aria-describedby": erros[field] ? `${field}-erro` : undefined,
    };
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
          autoComplete="email"
          maxLength={254}
          placeholder="seu@email.com"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={`${inputBase} ${erros.email ? "border-red-500" : "border-border"}`}
          {...a11y("email")}
        />
        {campoErro("email")}
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
          autoComplete="current-password"
          maxLength={SENHA_MAX}
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          className={`${inputBase} ${erros.password ? "border-red-500" : "border-border"}`}
          {...a11y("password")}
        />
        {campoErro("password")}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-10 w-full rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {loading ? "Entrando..." : "Entrar"}
      </button>

      <p className="text-center text-xs text-muted">
        Ainda não tem conta?{" "}
        <Link
          href={
            callbackUrl === "/"
              ? "/cadastro"
              : `/cadastro?callbackUrl=${encodeURIComponent(callbackUrl)}`
          }
          className="text-brand hover:underline"
        >
          Criar conta
        </Link>
      </p>
    </form>
  );
}
