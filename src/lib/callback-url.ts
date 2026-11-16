// Só aceita caminhos internos ("/perfil"), para o parâmetro callbackUrl não
// virar um redirecionamento para outro site ("https://..." ou "//...").
export function safeCallbackUrl(valor: string | null | undefined) {
  return valor?.startsWith("/") && !valor.startsWith("//") ? valor : "/";
}
