"use client";

import { useState, useSyncExternalStore } from "react";
import Link from "next/link";

type CookieConsentProps = {
  title?: string;
  description?: string;
  privacyHref?: string;
};

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot() {
  try {
    return localStorage.getItem("cookie-consent");
  } catch {
    return null;
  }
}

export function CookieConsent({
  title = "Este site utiliza cookies",
  description = "Usamos cookies para garantir o funcionamento do site e melhorar sua experiência de navegação. Você pode aceitar ou recusar o uso.",
  privacyHref,
}: CookieConsentProps) {
  const [dismissed, setDismissed] = useState(false);
  const consent = useSyncExternalStore(subscribe, getSnapshot, () => "server");

  if (dismissed || consent !== null) return null;

  const handleChoice = (choice: "accepted" | "rejected") => {
    try {
      localStorage.setItem("cookie-consent", choice);
    } catch {
      // Ignora erro se localStorage não estiver disponível
    }
    setDismissed(true);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-gutter pb-4 sm:pb-6">
      <section
        aria-labelledby="cookie-consent-title"
        aria-describedby="cookie-consent-description"
        className="cookie-consent-enter pointer-events-auto mx-auto flex w-full max-w-4xl flex-col gap-4 rounded-lg border border-border bg-surface p-card shadow-lg shadow-black/10 sm:flex-row sm:items-center sm:gap-6"
      >
        <div className="flex-1">
          <h2
            id="cookie-consent-title"
            className="text-sm font-semibold text-foreground"
          >
            {title}
          </h2>
          <p
            id="cookie-consent-description"
            className="mt-1 text-sm text-muted"
          >
            {description}
            {privacyHref ? (
              <>
                {" "}
                <Link
                  href={privacyHref}
                  className="font-medium text-brand underline underline-offset-2 transition-colors hover:text-brand-hover"
                >
                  Política de Privacidade
                </Link>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:shrink-0">
          <button
            type="button"
            onClick={() => handleChoice("rejected")}
            className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-muted hover:bg-background"
          >
            Recusar cookies
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
          >
            Aceitar cookies
          </button>
        </div>
      </section>
    </div>
  );
}
