import { z } from "zod";

// Regras de senha compartilhadas pelo formulário de cadastro e pela API, para
// as duas pontas validarem do mesmo jeito.
export const SENHA_MIN = 8;
export const SENHA_MAX = 128;

export const senhaSchema = z
  .string()
  .min(SENHA_MIN, `A senha precisa ter ao menos ${SENHA_MIN} caracteres`)
  .max(SENHA_MAX, `A senha pode ter no máximo ${SENHA_MAX} caracteres`);
