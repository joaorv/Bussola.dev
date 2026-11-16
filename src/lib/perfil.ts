import type { Prisma } from "@/generated/prisma/client";
import type { FotoTipo } from "@/lib/perfil-validation";

// Campos do perfil que podem ir para a tela ou para a API. Fica de fora o que
// é sensível (senhaHash) e os bytes da foto, que só a rota da foto lê.
export const perfilSelect = {
  nome: true,
  email: true,
  profissao: true,
  localizacao: true,
  sobre: true,
  linkedinUrl: true,
  githubUrl: true,
  siteUrl: true,
  areasInteresse: true,
  fotoAtualizadaEm: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PerfilDados = Prisma.UserGetPayload<{ select: typeof perfilSelect }>;

// URL da foto do usuário logado. O ?v= muda a cada troca, então o navegador
// pode guardar a imagem em cache para sempre sem mostrar uma foto antiga.
export function fotoUrl(fotoAtualizadaEm: Date | null) {
  return fotoAtualizadaEm ? `/api/perfil/foto?v=${fotoAtualizadaEm.getTime()}` : null;
}

// O que a API devolve: os dados do perfil com a URL da foto no lugar da data.
export function serializarPerfil({ fotoAtualizadaEm, ...perfil }: PerfilDados) {
  return { ...perfil, fotoUrl: fotoUrl(fotoAtualizadaEm) };
}

// Descobre o formato pelos primeiros bytes do arquivo, sem confiar no
// Content-Type nem na extensão que o navegador mandou.
export function detectarTipoImagem(bytes: Uint8Array): FotoTipo | null {
  const comeca = (assinatura: number[], offset = 0) =>
    assinatura.every((b, i) => bytes[offset + i] === b);

  if (comeca([0xff, 0xd8, 0xff])) return "image/jpeg";
  if (comeca([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) return "image/png";
  // "RIFF" .... "WEBP"
  if (comeca([0x52, 0x49, 0x46, 0x46]) && comeca([0x57, 0x45, 0x42, 0x50], 8)) {
    return "image/webp";
  }
  return null;
}
