// Estados (UF) e helpers de localização, usados pelo perfil e pelo conteúdo
// regional para comparar "onde a pessoa está" com "onde o conteúdo acontece".

export const UFS = [
  { sigla: "AC", nome: "Acre" },
  { sigla: "AL", nome: "Alagoas" },
  { sigla: "AP", nome: "Amapá" },
  { sigla: "AM", nome: "Amazonas" },
  { sigla: "BA", nome: "Bahia" },
  { sigla: "CE", nome: "Ceará" },
  { sigla: "DF", nome: "Distrito Federal" },
  { sigla: "ES", nome: "Espírito Santo" },
  { sigla: "GO", nome: "Goiás" },
  { sigla: "MA", nome: "Maranhão" },
  { sigla: "MT", nome: "Mato Grosso" },
  { sigla: "MS", nome: "Mato Grosso do Sul" },
  { sigla: "MG", nome: "Minas Gerais" },
  { sigla: "PA", nome: "Pará" },
  { sigla: "PB", nome: "Paraíba" },
  { sigla: "PR", nome: "Paraná" },
  { sigla: "PE", nome: "Pernambuco" },
  { sigla: "PI", nome: "Piauí" },
  { sigla: "RJ", nome: "Rio de Janeiro" },
  { sigla: "RN", nome: "Rio Grande do Norte" },
  { sigla: "RS", nome: "Rio Grande do Sul" },
  { sigla: "RO", nome: "Rondônia" },
  { sigla: "RR", nome: "Roraima" },
  { sigla: "SC", nome: "Santa Catarina" },
  { sigla: "SP", nome: "São Paulo" },
  { sigla: "SE", nome: "Sergipe" },
  { sigla: "TO", nome: "Tocantins" },
] as const;

export type UF = (typeof UFS)[number]["sigla"];

const SIGLAS = new Set<string>(UFS.map((uf) => uf.sigla));

export function ehUF(valor: unknown): valor is UF {
  return typeof valor === "string" && SIGLAS.has(valor);
}

// Para comparar nomes de cidade digitados de jeitos diferentes:
// "São Paulo", "sao paulo" e " SÃO  PAULO " viram "sao paulo".
export function normalizarCidade(cidade: string) {
  return cidade
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

// "Campinas, SP", "SP" ou null.
export function formatarLocal(cidade: string | null, estado: string | null) {
  if (cidade && estado) return `${cidade}, ${estado}`;
  return cidade || estado || null;
}
