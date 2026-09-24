import { z } from "zod";

export const areasPredefinidas = [
  "Desenvolvimento Web",
  "Desenvolvimento Mobile",
  "Backend",
  "Frontend",
  "Banco de Dados",
  "DevOps",
  "Dados e IA",
  "Segurança",
] as const;

export const nomeSchema = z
  .string()
  .trim()
  .min(2, "Nome muito curto")
  .max(100, "Nome muito longo")
  .regex(
    /^[\p{L}\p{M}]+(?:[ '-][\p{L}\p{M}]+)*$/u,
    "Nome inválido"
  );

export const emailSchema = z
  .string()
  .trim()
  .email("E-mail inválido")
  .max(254, "E-mail muito longo")
  .transform((valor) => valor.toLowerCase());

export const areaInteresseSchema = z
  .string()
  .trim()
  .min(2, "Área de interesse inválida")
  .max(100, "Área de interesse muito longa")
  .refine(
    (valor) =>
      areasPredefinidas.includes(
        valor as (typeof areasPredefinidas)[number]
      ) ||
      /^[\p{L}\p{M}0-9][\p{L}\p{M}0-9 .+#&/'-]*$/u.test(valor),
    "Área de interesse inválida"
  );