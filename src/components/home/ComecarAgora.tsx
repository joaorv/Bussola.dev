import Link from "next/link";

// Chamada final da home (substitui o antigo formulário da lista de espera).
// Quem já tem conta vai direto para os roadmaps.
export function ComecarAgora({ logado }: { logado: boolean }) {
  return (
    <section
      id="comecar"
      aria-labelledby="comecar-title"
      className="bg-night px-gutter py-section-sm text-white"
    >
      <div className="mx-auto flex w-full max-w-xl flex-col items-center text-center">
        <h2 id="comecar-title" className="text-3xl font-semibold text-balance">
          {logado ? "Sua trilha está te esperando" : "Pronto para traçar sua rota?"}
        </h2>
        <p className="mt-3 text-white/70">
          {logado
            ? "Continue de onde parou e acompanhe seu progresso em cada etapa."
            : "Crie sua conta, escolha um roadmap e marque cada tópico conforme avança."}
        </p>

        <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
          <Link
            href={logado ? "/roadmaps" : "/cadastro"}
            className="inline-flex h-12 w-full items-center justify-center rounded-md bg-accent px-7 text-base font-medium text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover active:bg-accent-active sm:w-auto"
          >
            {logado ? "Ver roadmaps" : "Criar minha conta"}
          </Link>
          {!logado && (
            <Link
              href="/login"
              className="text-sm font-medium text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
            >
              Já tenho conta
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
