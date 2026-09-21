"use client";

import { useState } from "react";

type Erros = {
    nome: string;
    email: string;
    areaInteresse: string;
    outroInteresse: string;
};

const errosVazios: Erros = {
    nome: "",
    email: "",
    areaInteresse: "",
    outroInteresse: "",
};

export function LeadForm() {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [areaInteresse, setAreaInteresse] = useState("");
    const [outroInteresse, setOutroInteresse] = useState("");
    const [website, setWebsite] = useState("");

    const [erros, setErros] = useState<Erros>(errosVazios);

    const [mensagem, setMensagem] = useState("");
    const [tipoMensagem, setTipoMensagem] = useState<"sucesso" | "erro" | "">(
        ""
    );
    const [enviando, setEnviando] = useState(false);

    function limparErro(campo: keyof Erros) {
        setErros((errosAtuais) => ({
            ...errosAtuais,
            [campo]: "",
        }));
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        setMensagem("");
        setTipoMensagem("");

        const novosErros: Erros = { ...errosVazios };

        // Nome
        if (!nome.trim()) {
            novosErros.nome = "Digite seu nome.";
        } else if (nome.trim().length < 2) {
            novosErros.nome = "Nome muito curto.";
        } else if (
            !/^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u.test(nome.trim())
        ) {
            novosErros.nome = "Nome inválido.";
        }

        // E-mail
        if (!email.trim()) {
            novosErros.email = "Digite seu e-mail.";
        } else if (
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
        ) {
            novosErros.email = "Digite um e-mail válido.";
        }

        // Área de interesse
        if (!areaInteresse) {
            novosErros.areaInteresse = "Selecione uma área de interesse.";
        }

        // Outra área
        if (areaInteresse === "Outro") {
            if (!outroInteresse.trim()) {
                novosErros.outroInteresse = "Digite sua área de interesse.";
            } else if (outroInteresse.trim().length < 2) {
                novosErros.outroInteresse = "Área de interesse muito curta.";
            } else if (
                !/^[\p{L}\p{M}0-9][\p{L}\p{M}0-9 .+#&/'-]*$/u.test(
                    outroInteresse.trim()
                )
            ) {
                novosErros.outroInteresse = "Área de interesse inválida.";
            }
        }

        setErros(novosErros);

        // Impede o envio se houver qualquer erro
        if (Object.values(novosErros).some((erro) => erro !== "")) {
            return;
        }

        setEnviando(true);

        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    nome: nome.trim(),
                    email: email.trim(),
                    areaInteresse:
                        areaInteresse === "Outro"
                            ? outroInteresse.trim()
                            : areaInteresse,
                    website,
                }),
            });

            const data = await response.json();

            if (response.status === 201) {
                setMensagem("Cadastro realizado com sucesso!");
                setTipoMensagem("sucesso");

                setNome("");
                setEmail("");
                setAreaInteresse("");
                setOutroInteresse("");
                setWebsite("");
                setErros({ ...errosVazios });

                return;
            }

            if (response.status === 409) {
                setMensagem("Este e-mail já está cadastrado.");
                setTipoMensagem("erro");
                return;
            }

            if (response.status === 400) {
                setMensagem("Verifique os dados preenchidos.");
                setTipoMensagem("erro");
                return;
            }

            setMensagem("Não foi possível realizar o cadastro.");
            setTipoMensagem("erro");
        } catch (error) {
            console.error("Erro ao enviar formulário:", error);

            setMensagem("Erro de conexão. Tente novamente.");
            setTipoMensagem("erro");
        } finally {
            setEnviando(false);
        }
    }

    return (
        <section
            id="lista-de-espera"
            className="bg-night px-gutter py-section-sm text-white"
        >
            <div className="mx-auto w-full max-w-xl">
                <h2 className="text-3xl font-semibold">
                    Entre na lista de espera
                </h2>

                <p className="mt-3 text-white/70">
                    Deixe seus dados para acompanhar o lançamento do Bussola.dev.
                </p>

                <form
                    onSubmit={handleSubmit}
                    className="mt-8 flex w-full flex-col gap-4"
                >
                    {/* Nome */}
                    <div>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            maxLength={100}
                            autoComplete="name"
                            onChange={(e) => {
                                setNome(e.target.value);
                                limparErro("nome");
                            }}
                            className={`w-full rounded-md border bg-white p-3 text-black outline-none ${erros.nome
                                ? "border-red-500"
                                : "border-white/20"
                                }`}
                        />

                        {erros.nome && (
                            <p className="mt-1 text-sm text-red-400">
                                {erros.nome}
                            </p>
                        )}
                    </div>

                    {/* E-mail */}
                    <div>
                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            maxLength={254}
                            autoComplete="email"
                            onChange={(e) => {
                                setEmail(e.target.value);
                                limparErro("email");
                            }}
                            className={`w-full rounded-md border bg-white p-3 text-black outline-none ${erros.email
                                ? "border-red-500"
                                : "border-white/20"
                                }`}
                        />

                        {erros.email && (
                            <p className="mt-1 text-sm text-red-400">
                                {erros.email}
                            </p>
                        )}
                    </div>

                    {/* Área */}
                    <div>
                        <select
                            value={areaInteresse}
                            onChange={(e) => {
                                const valor = e.target.value;

                                setAreaInteresse(valor);
                                limparErro("areaInteresse");

                                if (valor !== "Outro") {
                                    setOutroInteresse("");
                                    limparErro("outroInteresse");
                                }
                            }}
                            className={`w-full rounded-md border bg-white p-3 text-black outline-none ${erros.areaInteresse
                                ? "border-red-500"
                                : "border-white/20"
                                }`}
                        >
                            <option value="">
                                Selecione sua área de interesse
                            </option>
                            <option value="Desenvolvimento Web">
                                Desenvolvimento Web
                            </option>
                            <option value="Desenvolvimento Mobile">
                                Desenvolvimento Mobile
                            </option>
                            <option value="Backend">Backend</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Banco de Dados">
                                Banco de Dados
                            </option>
                            <option value="DevOps">DevOps</option>
                            <option value="Dados e IA">Dados e IA</option>
                            <option value="Segurança">Segurança</option>
                            <option value="Outro">Outro</option>
                        </select>

                        {erros.areaInteresse && (
                            <p className="mt-1 text-sm text-red-400">
                                {erros.areaInteresse}
                            </p>
                        )}
                    </div>

                    {/* Outra área */}
                    {areaInteresse === "Outro" && (
                        <div>
                            <input
                                type="text"
                                placeholder="Digite sua área de interesse"
                                value={outroInteresse}
                                maxLength={100}
                                onChange={(e) => {
                                    setOutroInteresse(e.target.value);
                                    limparErro("outroInteresse");
                                }}
                                className={`w-full rounded-md border bg-white p-3 text-black outline-none ${erros.outroInteresse
                                    ? "border-red-500"
                                    : "border-white/20"
                                    }`}
                            />

                            {erros.outroInteresse && (
                                <p className="mt-1 text-sm text-red-400">
                                    {erros.outroInteresse}
                                </p>
                            )}
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
                            value={website}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>

                    {/* Botão */}
                    <button
                        type="submit"
                        disabled={enviando}
                        className="h-12 w-full rounded-md bg-accent font-medium text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {enviando ? "Enviando..." : "Quero participar"}
                    </button>

                    {/* Mensagem */}
                    {mensagem && (
                        <p
                            className={`text-center text-sm ${tipoMensagem === "sucesso"
                                ? "text-green-400"
                                : "text-red-400"
                                }`}
                        >
                            {mensagem}
                        </p>
                    )}
                </form>
            </div>
        </section>
    );
}