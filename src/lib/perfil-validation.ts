import { z } from "zod";
import {
  areaInteresseSchema,
  MAX_AREAS_INTERESSE,
  nomeSchema,
} from "@/lib/lead-validation";

// Regras do perfil editável, compartilhadas pelo formulário de /perfil/editar
// e pela API (PATCH /api/perfil), para as duas pontas validarem do mesmo jeito.

export const PROFISSAO_MAX = 120;
export const LOCALIZACAO_MAX = 100;
export const SOBRE_MAX = 2000;
export const LINK_MAX = 300;

// Caracteres de controle (exceto quebra de linha/tab no "Sobre") não têm por que
// aparecer num perfil e atrapalham a exibição.
const CONTROLE_UMA_LINHA = /[\u0000-\u001F\u007F]/;
const CONTROLE_MULTILINHA = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/;

// Campo de texto opcional: "" ou null apagam o valor (vira null no banco).
function textoOpcional(max: number, rotulo: string, multilinha = false) {
  return z
    .union([z.string(), z.null()])
    .transform((v) => v?.trim() || null)
    .pipe(
      z
        .string()
        .max(max, `${rotulo} pode ter no máximo ${max} caracteres`)
        .refine(
          (v) => !(multilinha ? CONTROLE_MULTILINHA : CONTROLE_UMA_LINHA).test(v),
          `${rotulo} contém caracteres inválidos`
        )
        .nullable()
    );
}

// Link opcional. Aceita "github.com/fulano" (sem protocolo) e completa com
// https://. Só http(s), para não gravar javascript:, data: etc. Com `dominio`,
// exige que o link seja daquele site (ex.: o campo LinkedIn só aceita linkedin.com).
function linkOpcional(dominio?: { host: string; nome: string }) {
  return z.union([z.string(), z.null()]).transform((valor, ctx) => {
    const texto = valor?.trim();
    if (!texto) return null;

    if (texto.length > LINK_MAX) {
      ctx.addIssue({ code: "custom", message: "Link muito longo" });
      return z.NEVER;
    }

    let url: URL;
    try {
      url = new URL(/^[a-z][a-z0-9+.-]*:/i.test(texto) ? texto : `https://${texto}`);
    } catch {
      ctx.addIssue({ code: "custom", message: "Link inválido" });
      return z.NEVER;
    }

    if (
      (url.protocol !== "https:" && url.protocol !== "http:") ||
      !url.hostname.includes(".") ||
      url.username ||
      url.password
    ) {
      ctx.addIssue({ code: "custom", message: "Link inválido" });
      return z.NEVER;
    }

    if (
      dominio &&
      url.hostname !== dominio.host &&
      !url.hostname.endsWith(`.${dominio.host}`)
    ) {
      ctx.addIssue({ code: "custom", message: `Use um link do ${dominio.nome}` });
      return z.NEVER;
    }

    return url.toString();
  });
}

export const profissaoSchema = textoOpcional(PROFISSAO_MAX, "A profissão");
export const localizacaoSchema = textoOpcional(LOCALIZACAO_MAX, "A localização");
export const sobreSchema = textoOpcional(SOBRE_MAX, "O texto", true);
export const linkedinUrlSchema = linkOpcional({ host: "linkedin.com", nome: "LinkedIn" });
export const githubUrlSchema = linkOpcional({ host: "github.com", nome: "GitHub" });
export const siteUrlSchema = linkOpcional();

// No perfil a lista pode ficar vazia (diferente da lista de espera, que exige
// ao menos uma área).
export const areasPerfilSchema = z
  .array(areaInteresseSchema)
  .max(MAX_AREAS_INTERESSE, `Escolha no máximo ${MAX_AREAS_INTERESSE} áreas`)
  .transform((areas) => [...new Set(areas)]);

// Atualização parcial: só os campos enviados mudam. `.strict()` recusa
// qualquer outro campo (email, senhaHash, id...), então o body nunca chega
// direto ao banco.
export const perfilUpdateSchema = z
  .object({
    nome: nomeSchema,
    profissao: profissaoSchema,
    localizacao: localizacaoSchema,
    sobre: sobreSchema,
    linkedinUrl: linkedinUrlSchema,
    githubUrl: githubUrlSchema,
    siteUrl: siteUrlSchema,
    areasInteresse: areasPerfilSchema,
  })
  .partial()
  .strict()
  .refine((dados) => Object.keys(dados).length > 0, "Nenhum campo para atualizar");

export type PerfilUpdate = z.infer<typeof perfilUpdateSchema>;

// Foto: o navegador recorta e reduz antes de enviar, então 1 MB sobra. O
// limite protege a rota de quem chamar a API direto.
export const FOTO_MAX_BYTES = 1024 * 1024;
export const FOTO_TIPOS = ["image/jpeg", "image/png", "image/webp"] as const;
export type FotoTipo = (typeof FOTO_TIPOS)[number];
