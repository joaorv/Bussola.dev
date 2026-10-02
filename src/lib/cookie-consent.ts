// Preferência de cookies guardada só no navegador (localStorage): não há
// conta nem banco envolvidos, e limpar os dados do site faz o banner voltar.

export const COOKIE_CONSENT_KEY = "cookie-consent";

export type CookieConsent = "accepted" | "rejected";

// Evento disparado na mesma aba quando a escolha muda. O evento nativo
// "storage" só chega às *outras* abas, então os dois são ouvidos.
const CHANGE_EVENT = "cookie-consent-change";

// Cópia em memória para quando o localStorage não está disponível: o banner
// ainda some após o clique, mas a escolha não sobrevive a um recarregamento.
let fallbackConsent: CookieConsent | null = null;

function isConsent(value: unknown): value is CookieConsent {
  return value === "accepted" || value === "rejected";
}

/** Escolha salva, ou null se o usuário ainda não decidiu. */
export function getCookieConsent(): CookieConsent | null {
  // localStorage pode lançar exceção (aba anônima, dados do site bloqueados).
  try {
    const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
    return isConsent(value) ? value : null;
  } catch {
    return fallbackConsent;
  }
}

export function setCookieConsent(value: CookieConsent) {
  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, value);
  } catch {
    fallbackConsent = value;
  }
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: value }));
}

export function subscribeCookieConsent(callback: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === COOKIE_CONSENT_KEY) callback();
  };

  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", onStorage);
  };
}
