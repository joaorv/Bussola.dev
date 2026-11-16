"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar } from "./Avatar";
import { Toast } from "@/components/layout/Toast";
import { FOTO_MAX_BYTES } from "@/lib/perfil-validation";

// Lado da foto salva. Suficiente para o maior avatar da aplicação em telas
// de alta densidade, e deixa o arquivo com poucas dezenas de KB.
const LADO = 400;

// Recorta o centro da imagem em um quadrado e reduz para LADO x LADO. Tenta
// WebP; navegadores sem suporte devolvem PNG, aí cai para JPEG.
async function prepararFoto(arquivo: File): Promise<Blob> {
  const bitmap = await createImageBitmap(arquivo);
  const lado = Math.min(bitmap.width, bitmap.height);
  const destino = Math.min(LADO, lado);

  const canvas = document.createElement("canvas");
  canvas.width = destino;
  canvas.height = destino;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas indisponível");

  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(
    bitmap,
    (bitmap.width - lado) / 2,
    (bitmap.height - lado) / 2,
    lado,
    lado,
    0,
    0,
    destino,
    destino
  );
  bitmap.close();

  const gerar = (tipo: string) =>
    new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, tipo, 0.85));

  const webp = await gerar("image/webp");
  if (webp?.type === "image/webp") return webp;

  const jpeg = await gerar("image/jpeg");
  if (!jpeg) throw new Error("falha ao gerar a imagem");
  return jpeg;
}

type Aviso = { type: "sucesso" | "erro"; title: string; description: string };

export function FotoPerfilEditor({
  nome,
  fotoUrlInicial,
}: {
  nome: string;
  fotoUrlInicial: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [fotoUrl, setFotoUrl] = useState(fotoUrlInicial);
  const [ocupado, setOcupado] = useState<"enviando" | "removendo" | null>(null);
  const [aviso, setAviso] = useState<Aviso | null>(null);
  const fecharAviso = useCallback(() => setAviso(null), []);

  const erro = (description: string) =>
    setAviso({ type: "erro", title: "Não deu certo", description });

  async function enviar(arquivo: File) {
    if (!arquivo.type.startsWith("image/")) {
      erro("Escolha um arquivo de imagem (JPG, PNG ou WebP).");
      return;
    }

    setOcupado("enviando");
    try {
      let foto: Blob;
      try {
        foto = await prepararFoto(arquivo);
      } catch {
        erro("Não foi possível ler esta imagem. Tente uma foto JPG ou PNG.");
        return;
      }

      if (foto.size > FOTO_MAX_BYTES) {
        erro("A imagem ficou grande demais. Tente outra foto.");
        return;
      }

      const dados = new FormData();
      dados.append("foto", foto, "foto");

      const res = await fetch("/api/perfil/foto", { method: "PUT", body: dados });
      const corpo = await res.json().catch(() => null);

      if (!res.ok) {
        erro(corpo?.error ?? "Não foi possível salvar a foto.");
        return;
      }

      setFotoUrl(corpo.fotoUrl);
      setAviso({ type: "sucesso", title: "Foto atualizada", description: "Sua nova foto já aparece no perfil." });
      router.refresh();
    } catch {
      erro("Erro de conexão. Tente novamente.");
    } finally {
      setOcupado(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  async function remover() {
    setOcupado("removendo");
    try {
      const res = await fetch("/api/perfil/foto", { method: "DELETE" });
      if (!res.ok) {
        const corpo = await res.json().catch(() => null);
        erro(corpo?.error ?? "Não foi possível remover a foto.");
        return;
      }

      setFotoUrl(null);
      setAviso({ type: "sucesso", title: "Foto removida", description: "O perfil volta a mostrar suas iniciais." });
      router.refresh();
    } catch {
      erro("Erro de conexão. Tente novamente.");
    } finally {
      setOcupado(null);
    }
  }

  return (
    <section
      aria-labelledby="foto-title"
      className="rounded-lg border border-border bg-surface p-card"
    >
      <h2 id="foto-title" className="text-sm font-semibold text-foreground">
        Foto do perfil
      </h2>

      <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Avatar
          nome={nome}
          fotoUrl={fotoUrl}
          className="h-24 w-24 bg-ink-100 text-2xl text-foreground ring-1 ring-border"
        />

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={ocupado !== null}
              onClick={() => inputRef.current?.click()}
              className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover disabled:opacity-60"
            >
              {ocupado === "enviando" ? "Enviando..." : fotoUrl ? "Trocar foto" : "Adicionar foto"}
            </button>
            {fotoUrl && (
              <button
                type="button"
                disabled={ocupado !== null}
                onClick={remover}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-ink-100 disabled:opacity-60"
              >
                {ocupado === "removendo" ? "Removendo..." : "Remover"}
              </button>
            )}
          </div>
          <p className="text-xs text-muted">
            JPG, PNG ou WebP. A imagem é recortada no centro em formato quadrado.
          </p>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            const arquivo = e.target.files?.[0];
            if (arquivo) enviar(arquivo);
          }}
        />
      </div>

      {aviso && <Toast {...aviso} onClose={fecharAviso} />}
    </section>
  );
}
