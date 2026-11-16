"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { emailSchema, nomeSchema } from "@/lib/lead-validation";
import { SENHA_MAX, senhaSchema } from "@/lib/user-validation";
import { safeCallbackUrl } from "@/lib/callback-url";
import { PRIVACY_POLICY_HREF, TERMS_OF_USE_HREF } from "@/lib/legal";

const initialForm = {
  nome: "",
  email: "",
  password: "",
  confirmPassword: "",
  website: "", // honeypot: fica escondido, só robô preenche
  aceiteTermos: false,
};

type Campo = keyof typeof initialForm;
type Erros = Partial<Record<Campo, string>>;

function validar(form: typeof initialForm): Erros {
  const erros: Erros = {};

  const nome = nomeSchema.safeParse(form.nome);
  if (!form.nome.trim()) erros.nome = "Digite seu nome.";
  else if (!nome.success) erros.nome = nome.error.issues[0].message;

  if (!form.email.trim()) erros.email = "Digite seu e-mail.";
  else if (!emailSchema.safeParse(form.email).success) erros.email = "Digite um e-mail válido.";

  const senha = senhaSchema.safeParse(form.password);
  if (!form.password) erros.password = "Crie uma senha.";
  else if (!senha.success) erros.password = senha.error.issues[0].message;

  if (!form.confirmPassword) erros.confirmPassword = "Confirme sua senha.";
  else if (form.confirmPassword !== form.password) erros.confirmPassword = "As senhas não conferem.";

  if (!form.aceiteTermos) {
    erros.aceiteTermos = "Aceite os Termos de Uso e a Política de Privacidade para continuar.";
  }

  return erros;
}

const inputBase =
  "mt-1.5 w-full rounded-md border bg-surface px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));

  const [form, setForm] = useState(initialForm);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function updateField<K extends Campo>(field: K, value: (typeof initialForm)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // O erro some assim que a pessoa mexe no campo.
    if (erros[field]) setErros((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroGeral(null);

    const novosErros = validar(form);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      // Leva o foco para o primeiro campo com erro.
      const primeiro = Object.keys(novosErros)[0];
      document.getElementById(primeiro)?.focus();
      return;
    }

    setErros({});
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          password: form.password,
          website: form.website,
          aceiteTermos: form.aceiteTermos,
        }),
      });

      if (res.status === 201) {
        // Conta criada: já faz o login para a pessoa não digitar tudo de novo.
        const login = await signIn("credentials", {
          email: form.email.trim(),
          password: form.password,
          redirect: false,
          callbackUrl,
        });

        if (login?.error) {
          router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
          return;
        }

        router.push(callbackUrl);
        router.refresh();
        return;
      }

      if (res.status === 409) {
        setErros({ email: "Este e-mail já está cadastrado." });
        document.getElementById("email")?.focus();
        return;
      }

      if (res.status === 400) {
        // A API devolve os erros por campo; mostra cada um no seu lugar.
        const data = await res.json().catch(() => null);
        const doServidor = data?.erros as Record<string, string[]> | undefined;
        const mapeados: Erros = {};
        for (const campo of ["nome", "email", "password", "aceiteTermos"] as const) {
          const msg = doServidor?.[campo]?.[0];
          if (msg) mapeados[campo] = msg;
        }
        if (Object.keys(mapeados).length > 0) setErros(mapeados);
        else setErroGeral("Verifique os dados preenchidos.");
        return;
      }

      if (res.status === 429) {
        setErroGeral("Muitas tentativas. Aguarde um minuto e tente novamente.");
        return;
      }

      setErroGeral("Não foi possível criar sua conta. Tente novamente.");
    } catch {
      setErroGeral("Erro de conexão. Tente novamente.");
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

  function borda(field: Campo) {
    return erros[field] ? "border-red-500" : "border-border";
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {erroGeral && (
        <div
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {erroGeral}
        </div>
      )}

      <div>
        <label htmlFor="nome" className="block text-sm font-medium text-foreground">
          Nome
        </label>
        <input
          id="nome"
          type="text"
          autoComplete="name"
          maxLength={100}
          placeholder="Seu nome"
          value={form.nome}
          onChange={(e) => updateField("nome", e.target.value)}
          className={`${inputBase} ${borda("nome")}`}
          {...a11y("nome")}
        />
        {campoErro("nome")}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">
          E-mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="seu@email.com"
          value={form.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={`${inputBase} ${borda("email")}`}
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
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          maxLength={SENHA_MAX}
          placeholder="Mínimo de 8 caracteres"
          value={form.password}
          onChange={(e) => updateField("password", e.target.value)}
          className={`${inputBase} ${borda("password")}`}
          {...a11y("password")}
        />
        {campoErro("password")}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground">
          Confirmar senha
        </label>
        <input
          id="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          maxLength={SENHA_MAX}
          placeholder="Repita a senha"
          value={form.confirmPassword}
          onChange={(e) => updateField("confirmPassword", e.target.value)}
          className={`${inputBase} ${borda("confirmPassword")}`}
          {...a11y("confirmPassword")}
        />
        {campoErro("confirmPassword")}
      </div>

      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(e) => updateField("website", e.target.value)}
        />
      </div>

      <div>
        <div className="flex items-start gap-2">
          <input
            id="aceiteTermos"
            type="checkbox"
            checked={form.aceiteTermos}
            onChange={(e) => updateField("aceiteTermos", e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-brand"
            {...a11y("aceiteTermos")}
          />
          {/* abre em nova aba para não perder o que já foi preenchido */}
          <label htmlFor="aceiteTermos" className="text-xs leading-5 text-muted">
            Li e concordo com os{" "}
            <Link
              href={TERMS_OF_USE_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Termos de Uso
            </Link>{" "}
            e com a{" "}
            <Link
              href={PRIVACY_POLICY_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              Política de Privacidade
            </Link>
            .
          </label>
        </div>
        {campoErro("aceiteTermos")}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-2 h-10 w-full rounded-md bg-brand text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
      >
        {loading ? "Criando conta..." : "Criar conta"}
      </button>

      <p className="text-center text-xs text-muted">
        Já tem conta?{" "}
        <Link
          href={
            callbackUrl === "/"
              ? "/login"
              : `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
          }
          className="text-brand hover:underline"
        >
          Entrar
        </Link>
      </p>
    </form>
  );
}
