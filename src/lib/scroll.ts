import type { MouseEvent } from "react";

/**
 * Rola suavemente até o elemento com o id especificado.
 * Se o usuário já estiver na home, previne o comportamento padrão do link para
 * garantir que a rolagem aconteça mesmo se o hash atual já for o mesmo.
 */
export function scrollToAnchor(
  e: MouseEvent<HTMLAnchorElement>,
  targetId: string
) {
  if (typeof window !== "undefined" && window.location.pathname === "/") {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  }
}

/**
 * Rola suavemente para o topo da página inicial ao clicar no logotipo.
 */
export function scrollToTop(e: MouseEvent<HTMLAnchorElement>) {
  if (typeof window !== "undefined" && window.location.pathname === "/") {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
      window.history.pushState(null, "", window.location.pathname);
    }
  }
}
