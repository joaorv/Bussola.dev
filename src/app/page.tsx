"use client";

import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [areaInteresse, setAreaInteresse] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    await fetch("/api/leads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        areaInteresse,
      }),
    });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow"
      >
        <h1 className="mb-2 text-2xl font-semibold text-black">
          Bussola.dev
        </h1>

        <p className="mb-6 text-zinc-600">
          Cadastre-se para acompanhar as novidades.
        </p>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="rounded-lg border p-3 text-black"
          />

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-lg border p-3 text-black"
          />

          <input
            type="text"
            placeholder="Área de interesse"
            value={areaInteresse}
            onChange={(e) => setAreaInteresse(e.target.value)}
            className="rounded-lg border p-3 text-black"
          />

          <button
            type="submit"
            className="rounded-lg bg-black p-3 font-medium text-white hover:bg-zinc-800"
          >
            Quero participar
          </button>
        </div>
      </form>
    </main>
  );
}