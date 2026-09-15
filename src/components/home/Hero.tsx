import Link from "next/link";
import { LAUNCH_DATE } from "@/lib/launch";
import { CompassRose } from "./CompassRose";
import { Countdown } from "./Countdown";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-night text-white">
      {/* profundidade: um clarão atrás da bússola */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_78%_38%,rgba(78,127,203,0.22),transparent_70%)]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-16 px-gutter py-section-sm lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:py-section">
        <div className="flex min-w-0 flex-col items-start">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Escolher o que estudar não deveria ser um chute.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
            Sua trilha de carreira em tecnologia, conectada à sua região.
            Roadmap de estudos + cursos, empresas, eventos e comunidades perto
            de você.
          </p>

          <Link
            href="#lista-de-espera"
            className="mt-10 inline-flex h-12 items-center justify-center rounded-md bg-accent px-7 text-base font-medium text-white shadow-lg shadow-accent/20 transition-colors hover:bg-accent-hover active:bg-accent-active"
          >
            Entrar na lista de espera
          </Link>

          <Countdown
            target={LAUNCH_DATE}
            label="Faltam para o lançamento"
            className="mt-12"
          />
        </div>

        <div className="relative flex min-w-0 justify-center lg:justify-end">
          <CompassRose className="compass-art w-full max-w-sm lg:max-w-lg" />
        </div>
      </div>
    </section>
  );
}
