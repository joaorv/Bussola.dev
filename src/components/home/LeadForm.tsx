"use client";

import { useCallback, useState } from "react";
import { Toast } from "@/components/layout/Toast";
import {
  areaInteresseSchema,
  areasPredefinidas,
  emailSchema,
  nomeSchema,
} from "@/lib/lead-validation";

const initialForm = {
  nome: "",
  email: "",
  areaInteresse: "",
  outroInteresse: "",
  website: "",
};

export function LeadForm() {
  const [form, setForm] = useState(initialForm);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{
    id: number;
    type: "sucesso" | "erro";
    title: string;
    text: string;
  } | null>(null);
  const [enviando, setEnviando] = useState(false);

  const fecharFeedback = useCallback(() => setFeedback(null), []);

  function updateField(field: keyof typeof initialForm, value: string) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
      ...(field === "areaInteresse" && value !== "Outro" ? { outroInteresse: "" } : {}),
    }));
    if (erros[field]) {
      setErros((prev) => ({ ...prev, [field]: "" }));
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);

    const novosErros: Record<string, string> = {};

    const valNome = nomeSchema.safeParse(form.nome);
    if (!form.nome.trim()) novosErros.nome = "Digite seu nome.";
    else if (!valNome.success) novosErros.nome = valNome.error.issues[0].message;

    const valEmail = emailSchema.safeParse(form.email);
    if (!form.email.trim()) novosErros.email = "Digite seu e-mail.";
    else if (!valEmail.success) novosErros.email = "Digite um e-mail válido.";

    if (!form.areaInteresse) {
      novosErros.areaInteresse = "Selecione uma área de interesse.";
    } else if (form.areaInteresse === "Outro") {
      if (!form.outroInteresse.trim()) {
        novosErros.outroInteresse = "Digite sua área de interesse.";
      } else {
        const valArea = areaInteresseSchema.safeParse(form.outroInteresse);
        if (!valArea.success) novosErros.outroInteresse = valArea.error.issues[0].message;
      }
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErros({});
    setEnviando(true);

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: form.nome.trim(),
          email: form.email.trim(),
          areaInteresse: form.areaInteresse === "Outro" ? form.outroInteresse.trim() : form.areaInteresse,
          website: form.website,
        }),
      });

      if (response.status === 201) {
        setFeedback({
          id: Date.now(),
          type: "sucesso",
          title: "Cadastro realizado!",
          text: "Você entrou na lista de espera do Bussola.dev.",
        });
        setForm(initialForm);
        return;
      }

      const msg =
        response.status === 409
          ? "Este e-mail já está cadastrado."
          : response.status === 400
          ? "Verifique os dados preenchidos."
          : "Não foi possível realizar o cadastro.";

      setFeedback({ id: Date.now(), type: "erro", title: "Não foi possível cadastrar", text: msg });
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setFeedback({
        id: Date.now(),
        type: "erro",
        title: "Não foi possível cadastrar",
        text: "Erro de conexão. Tente novamente.",
      });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="lista-de-espera" className="bg-night px-gutter py-section-sm text-white">
      <div className="mx-auto w-full max-w-xl">
        <h2 className="text-3xl font-semibold">Entre na lista de espera</h2>
        <p className="mt-3 text-white/70">
          Deixe seus dados para acompanhar o lançamento do Bussola.dev.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex w-full flex-col gap-4">
          <div>
            <label htmlFor="nome" className="sr-only">Nome</label>
            <input
              id="nome"
              type="text"
              placeholder="Nome"
              value={form.nome}
              maxLength={100}
              autoComplete="name"
              onChange={(e) => updateField("nome", e.target.value)}
              className={`w-full rounded-md border bg-white p-3 text-black outline-none ${
                erros.nome ? "border-red-500" : "border-white/20"
              }`}
            />
            {erros.nome && <p className="mt-1 text-sm text-red-400">{erros.nome}</p>}
          </div>

          <div>
            <label htmlFor="email" className="sr-only">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="E-mail"
              value={form.email}
              maxLength={254}
              autoComplete="email"
              onChange={(e) => updateField("email", e.target.value)}
              className={`w-full rounded-md border bg-white p-3 text-black outline-none ${
                erros.email ? "border-red-500" : "border-white/20"
              }`}
            />
            {erros.email && <p className="mt-1 text-sm text-red-400">{erros.email}</p>}
          </div>

          <div>
            <label htmlFor="areaInteresse" className="sr-only">Área de interesse</label>
            <select
              id="areaInteresse"
              value={form.areaInteresse}
              onChange={(e) => updateField("areaInteresse", e.target.value)}
              className={`w-full rounded-md border bg-white p-3 text-black outline-none ${
                erros.areaInteresse ? "border-red-500" : "border-white/20"
              }`}
            >
              <option value="">Selecione sua área de interesse</option>
              {areasPredefinidas.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
              <option value="Outro">Outro</option>
            </select>
            {erros.areaInteresse && <p className="mt-1 text-sm text-red-400">{erros.areaInteresse}</p>}
          </div>

          {form.areaInteresse === "Outro" && (
            <div>
              <label htmlFor="outroInteresse" className="sr-only">Outra área de interesse</label>
              <input
                id="outroInteresse"
                type="text"
                placeholder="Digite sua área de interesse"
                value={form.outroInteresse}
                maxLength={100}
                onChange={(e) => updateField("outroInteresse", e.target.value)}
                className={`w-full rounded-md border bg-white p-3 text-black outline-none ${
                  erros.outroInteresse ? "border-red-500" : "border-white/20"
                }`}
              />
              {erros.outroInteresse && <p className="mt-1 text-sm text-red-400">{erros.outroInteresse}</p>}
            </div>
          )}

          <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={form.website}
              onChange={(e) => updateField("website", e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="h-12 w-full rounded-md bg-accent font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? "Enviando..." : "Quero participar"}
          </button>
        </form>
      </div>

      {feedback && (
        <Toast
          key={feedback.id}
          type={feedback.type}
          title={feedback.title}
          description={feedback.text}
          onClose={fecharFeedback}
        />
      )}
    </section>
  );
}