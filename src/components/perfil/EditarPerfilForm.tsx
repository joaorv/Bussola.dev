"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { z } from "zod";
import { areasPredefinidas, MAX_AREAS_INTERESSE, nomeSchema } from "@/lib/lead-validation";
import { avisarPerfilAtualizado } from "@/lib/perfil-eventos";
import {
  githubUrlSchema,
  linkedinUrlSchema,
  LINK_MAX,
  CIDADE_MAX,
  cidadeSchema,
  estadoSchema,
  PROFISSAO_MAX,
  profissaoSchema,
  siteUrlSchema,
  SOBRE_MAX,
  sobreSchema,
} from "@/lib/perfil-validation";
import { UFS } from "@/lib/regioes";

export type PerfilFormValores = {
  nome: string;
  profissao: string;
  cidade: string;
  estado: string;
  sobre: string;
  linkedinUrl: string;
  githubUrl: string;
  siteUrl: string;
  areasInteresse: string[];
};

type CampoTexto = Exclude<keyof PerfilFormValores, "areasInteresse">;
type Campo = keyof PerfilFormValores;
type Erros = Partial<Record<Campo, string>>;

const schemas: Record<CampoTexto, z.ZodType> = {
  nome: nomeSchema,
  profissao: profissaoSchema,
  cidade: cidadeSchema,
  estado: estadoSchema,
  sobre: sobreSchema,
  linkedinUrl: linkedinUrlSchema,
  githubUrl: githubUrlSchema,
  siteUrl: siteUrlSchema,
};

function validar(form: PerfilFormValores): Erros {
  const erros: Erros = {};

  if (!form.nome.trim()) erros.nome = "Digite seu nome.";

  for (const campo of Object.keys(schemas) as CampoTexto[]) {
    if (erros[campo]) continue;
    const resultado = schemas[campo].safeParse(form[campo]);
    if (!resultado.success) erros[campo] = resultado.error.issues[0].message;
  }

  // Sem a UF não dá para achar conteúdo perto da pessoa.
  if (form.cidade.trim() && !form.estado && !erros.estado) {
    erros.estado = "Escolha o estado da sua cidade.";
  }

  if (form.areasInteresse.length > MAX_AREAS_INTERESSE) {
    erros.areasInteresse = `Escolha no máximo ${MAX_AREAS_INTERESSE} áreas.`;
  }

  return erros;
}

const inputBase =
  "mt-1.5 w-full rounded-md border bg-surface px-3 py-2 text-foreground outline-none focus:ring-2 focus:ring-brand";

export function EditarPerfilForm({ inicial }: { inicial: PerfilFormValores }) {
  const router = useRouter();
  const [form, setForm] = useState(inicial);
  const [erros, setErros] = useState<Erros>({});
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Áreas fora da lista padrão (ex.: "Outro" preenchido na lista de espera)
  // continuam aparecendo para poderem ser desmarcadas.
  const opcoesAreas = [
    ...areasPredefinidas,
    ...inicial.areasInteresse.filter(
      (a) => !(areasPredefinidas as readonly string[]).includes(a)
    ),
  ];

  function atualizar<K extends Campo>(campo: K, valor: PerfilFormValores[K]) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo]) setErros((prev) => ({ ...prev, [campo]: undefined }));
  }

  function alternarArea(area: string, marcada: boolean) {
    atualizar(
      "areasInteresse",
      marcada
        ? [...form.areasInteresse, area]
        : form.areasInteresse.filter((a) => a !== area)
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErroGeral(null);

    const novosErros = validar(form);
    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      document.getElementById(Object.keys(novosErros)[0])?.focus();
      return;
    }

    setErros({});
    setSalvando(true);

    try {
      const res = await fetch("/api/perfil", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        avisarPerfilAtualizado();
        router.push("/perfil");
        router.refresh();
        return;
      }

      const corpo = await res.json().catch(() => null);

      if (res.status === 400 && corpo?.erros) {
        const doServidor = corpo.erros as Record<string, string[] | undefined>;
        const mapeados: Erros = {};
        for (const campo of Object.keys(inicial) as Campo[]) {
          const msg = doServidor[campo]?.[0];
          if (msg) mapeados[campo] = msg;
        }
        if (Object.keys(mapeados).length > 0) {
          setErros(mapeados);
          return;
        }
      }

      if (res.status === 401) {
        router.push("/login?callbackUrl=/perfil/editar");
        return;
      }

      setErroGeral(corpo?.error ?? "Não foi possível salvar. Tente novamente.");
    } catch {
      setErroGeral("Erro de conexão. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  }

  function campoErro(campo: Campo) {
    const msg = erros[campo];
    return msg ? (
      <p id={`${campo}-erro`} className="mt-1 text-xs text-red-600 dark:text-red-400">
        {msg}
      </p>
    ) : null;
  }

  function props(campo: CampoTexto) {
    return {
      id: campo,
      value: form[campo],
      onChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
      ) =>
        atualizar(campo, e.target.value),
      className: `${inputBase} ${erros[campo] ? "border-red-500" : "border-border"}`,
      "aria-invalid": erros[campo] ? true : undefined,
      "aria-describedby": erros[campo] ? `${campo}-erro` : undefined,
    };
  }

  const rotulo = (htmlFor: CampoTexto, texto: string, opcional = true) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-foreground">
      {texto}
      {opcional && <span className="ml-1 font-normal text-muted">(opcional)</span>}
    </label>
  );

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {erroGeral && (
        <div
          role="alert"
          className="rounded-md border border-red-500/30 bg-red-500/10 p-3 text-sm font-medium text-red-600 dark:text-red-400"
        >
          {erroGeral}
        </div>
      )}

      <section
        aria-labelledby="intro-title"
        className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-card"
      >
        <h2 id="intro-title" className="text-sm font-semibold text-foreground">
          Apresentação
        </h2>

        <div>
          {rotulo("nome", "Nome", false)}
          <input type="text" autoComplete="name" maxLength={100} {...props("nome")} />
          {campoErro("nome")}
        </div>

        <div>
          {rotulo("profissao", "Profissão ou título")}
          <input
            type="text"
            autoComplete="organization-title"
            maxLength={PROFISSAO_MAX}
            placeholder="Ex.: Desenvolvedor Front-end Júnior"
            {...props("profissao")}
          />
          {campoErro("profissao")}
        </div>

        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <div>
            {rotulo("cidade", "Cidade")}
            <input
              type="text"
              autoComplete="address-level2"
              maxLength={CIDADE_MAX}
              placeholder="Ex.: Campinas"
              {...props("cidade")}
            />
            {campoErro("cidade")}
          </div>
          <div>
            {rotulo("estado", "Estado")}
            <select autoComplete="address-level1" {...props("estado")}>
              <option value="">Selecione</option>
              {UFS.map((uf) => (
                <option key={uf.sigla} value={uf.sigla}>
                  {uf.nome} ({uf.sigla})
                </option>
              ))}
            </select>
            {campoErro("estado")}
          </div>
          <p className="-mt-2 text-xs text-muted sm:col-span-2">
            Usamos sua cidade para mostrar cursos, eventos, empresas e comunidades perto de você.
          </p>
        </div>

        <div>
          {rotulo("sobre", "Sobre")}
          <textarea
            rows={5}
            maxLength={SOBRE_MAX}
            placeholder="Conte um pouco sobre você, o que estuda e onde quer chegar."
            {...props("sobre")}
          />
          <p className="mt-1 text-right text-xs text-muted tabular-nums">
            {form.sobre.length}/{SOBRE_MAX}
          </p>
          {campoErro("sobre")}
        </div>
      </section>

      <section
        aria-labelledby="links-title"
        className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-card"
      >
        <h2 id="links-title" className="text-sm font-semibold text-foreground">
          Links
        </h2>

        <div>
          {rotulo("linkedinUrl", "LinkedIn")}
          <input
            type="url"
            inputMode="url"
            maxLength={LINK_MAX}
            placeholder="linkedin.com/in/seu-perfil"
            {...props("linkedinUrl")}
          />
          {campoErro("linkedinUrl")}
        </div>

        <div>
          {rotulo("githubUrl", "GitHub")}
          <input
            type="url"
            inputMode="url"
            maxLength={LINK_MAX}
            placeholder="github.com/seu-usuario"
            {...props("githubUrl")}
          />
          {campoErro("githubUrl")}
        </div>

        <div>
          {rotulo("siteUrl", "Site ou portfólio")}
          <input
            type="url"
            inputMode="url"
            maxLength={LINK_MAX}
            placeholder="seusite.dev"
            {...props("siteUrl")}
          />
          {campoErro("siteUrl")}
        </div>
      </section>

      <fieldset
        id="areasInteresse"
        tabIndex={-1}
        aria-describedby={erros.areasInteresse ? "areasInteresse-erro" : undefined}
        className="rounded-lg border border-border bg-surface p-card outline-none"
      >
        <legend className="float-left text-sm font-semibold text-foreground">
          Áreas de interesse
        </legend>
        <ul className="clear-left flex flex-wrap gap-2 pt-4">
          {opcoesAreas.map((area) => {
            const marcada = form.areasInteresse.includes(area);
            return (
              <li key={area}>
                <label
                  className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors has-focus-visible:ring-2 has-focus-visible:ring-brand ${
                    marcada
                      ? "border-brand/30 bg-brand/10 text-brand"
                      : "border-border text-muted hover:text-foreground"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={marcada}
                    onChange={(e) => alternarArea(area, e.target.checked)}
                    className="sr-only"
                  />
                  {marcada && <span aria-hidden="true">✓</span>}
                  {area}
                </label>
              </li>
            );
          })}
        </ul>
        {campoErro("areasInteresse")}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Link
          href="/perfil"
          className="rounded-md border border-border px-4 py-2 text-center text-sm font-medium text-foreground transition-colors hover:bg-ink-100"
        >
          Cancelar
        </Link>
        <button
          type="submit"
          disabled={salvando}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
        >
          {salvando ? "Salvando..." : "Salvar alterações"}
        </button>
      </div>
    </form>
  );
}
