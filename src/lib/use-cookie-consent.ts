"use client";

import { useSyncExternalStore } from "react";
import {
  getCookieConsent,
  subscribeCookieConsent,
  type CookieConsent,
} from "@/lib/cookie-consent";

/**
 * Escolha de cookies do usuário, sincronizada entre componentes e abas.
 *
 * - `undefined`: ainda no servidor/hidratação, a escolha é desconhecida;
 * - `null`: o usuário ainda não decidiu;
 * - `"accepted"` | `"rejected"`: a escolha salva.
 *
 * O servidor não enxerga o localStorage; devolver `undefined` lá evita que o
 * HTML gerado e o primeiro render do cliente divirjam e quebrem a hidratação.
 */
export function useCookieConsent(): CookieConsent | null | undefined {
  return useSyncExternalStore(
    subscribeCookieConsent,
    getCookieConsent,
    () => undefined,
  );
}
