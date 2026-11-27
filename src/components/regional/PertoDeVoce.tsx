import Link from "next/link";
import {
  MODALIDADE_LABELS,
  TIPO_LABELS,
  type ConteudoPertoDeVoce,
} from "@/lib/conteudo-regional";
import { formatarLocal } from "@/lib/regioes";

type Props = {
  conteudos: ConteudoPertoDeVoce[];
  // Região do perfil; null = não informada (ou visitante).
  local: string | null;
  logado: boolean;
  callbackUrl: string;
};

const dataCurta = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "America/Sao_Paulo",
});

function onde(item: ConteudoPertoDeVoce) {
  if (!item.estado) return item.modalidade === "online" ? "Online" : "Brasil";
  return item.cidade ? formatarLocal(item.cidade, item.estado) : `Estado de ${item.estado}`;
}

// Cursos, empresas, eventos e comunidades ligados à trilha, do mais perto da
// pessoa (cidade) ao mais amplo (online/nacional).
export function PertoDeVoce({ conteudos, local, logado, callbackUrl }: Props) {
  return (
    <section
      aria-labelledby="perto-title"
      className="border-t border-border bg-surface px-gutter py-section-sm"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 id="perto-title" className="text-2xl font-semibold tracking-tight text-foreground">
          {local ? `Perto de você em ${local}` : "Para ir além da trilha"}
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          Cursos, empresas, eventos e comunidades que combinam com esta trilha
          {local ? ", começando pelos mais próximos." : "."}
        </p>

        {!local && (
          <p className="mt-4 rounded-md border border-brand/30 bg-brand/5 px-4 py-3 text-sm text-foreground">
            {logado ? (
              <>
                <Link
                  href="/perfil/editar"
                  className="font-medium text-brand underline underline-offset-2 hover:text-foreground"
                >
                  Informe sua cidade no perfil
                </Link>{" "}
                para ver também o que acontece perto de você.
              </>
            ) : (
              <>
                <Link
                  href={`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                  className="font-medium text-brand underline underline-offset-2 hover:text-foreground"
                >
                  Entre na sua conta
                </Link>{" "}
                e informe sua cidade para ver o que acontece perto de você.
              </>
            )}
          </p>
        )}

        {conteudos.length === 0 ? (
          <p className="mt-6 text-sm text-muted">Ainda não temos indicações para esta trilha.</p>
        ) : (
          <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {conteudos.map((item) => (
              <li
                key={item.id}
                className="flex flex-col rounded-lg border border-border bg-background p-card"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-full border border-brand/30 bg-brand/10 px-2.5 py-0.5 font-medium text-brand">
                    {TIPO_LABELS[item.tipo]}
                  </span>
                  {item.alcance === "cidade" && (
                    <span className="rounded-full border border-success/40 bg-success/10 px-2.5 py-0.5 font-medium text-success-active dark:text-success-hover">
                      Na sua cidade
                    </span>
                  )}
                  {item.gratuito && (
                    <span className="rounded-full border border-border bg-ink-100 px-2.5 py-0.5 font-medium text-muted">
                      Gratuito
                    </span>
                  )}
                </div>

                <h3 className="mt-3 text-base font-semibold text-foreground">{item.titulo}</h3>
                <p className="mt-1 text-xs text-muted">
                  {onde(item)}
                  {item.modalidade !== "online" && <> · {MODALIDADE_LABELS[item.modalidade]}</>}
                  {item.inicioEm && <> · {dataCurta.format(item.inicioEm)}</>}
                </p>
                <p className="mt-2 flex-1 text-sm leading-6 text-(--color-ink-700)">
                  {item.descricao}
                </p>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand transition-colors hover:text-foreground"
                  >
                    Visitar site
                    <span aria-hidden="true">↗</span>
                    <span className="sr-only">(abre em nova aba)</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
