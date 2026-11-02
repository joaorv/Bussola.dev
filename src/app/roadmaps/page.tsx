import type { Metadata } from "next";
import Link from "next/link";
import { requireLeadAccess } from "@/lib/lead-access";
import { countTopics, getRoadmaps } from "@/lib/roadmaps";

export const metadata: Metadata = {
  title: "Roadmaps | Bússola.dev",
  description: "Escolha uma trilha de carreira e siga as etapas na ordem certa.",
};

export default async function RoadmapsPage() {
  await requireLeadAccess();
  const roadmaps = getRoadmaps();

  return (
    <>
      <section
        aria-labelledby="roadmaps-title"
        className="bg-night px-gutter py-section-sm text-white"
      >
        <div className="mx-auto w-full max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">
            Você está na lista de espera
          </p>
          <h1
            id="roadmaps-title"
            className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            Escolha a sua trilha
          </h1>
          <p className="mt-4 max-w-2xl text-white/70">
            Cada roadmap está dividido em etapas, do básico ao avançado. Comece
            pela primeira e avance na ordem.
          </p>
        </div>
      </section>

      <div className="mx-auto w-full max-w-6xl px-gutter py-section-sm lg:py-section">
        <ul className="grid gap-6 md:grid-cols-3">
          {roadmaps.map((roadmap) => (
            <li key={roadmap.id}>
              <Link
                href={`/roadmaps/${roadmap.id}`}
                className="group flex h-full flex-col rounded-lg border border-border bg-surface p-card transition-colors hover:border-brand"
              >
                <h2 className="text-xl font-semibold text-foreground group-hover:text-brand">
                  {roadmap.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-6 text-muted">
                  {roadmap.description}
                </p>
                <p className="mt-6 text-xs text-muted">
                  {roadmap.categories.length} etapas · {countTopics(roadmap)}{" "}
                  tópicos
                </p>
                <span className="mt-4 text-sm font-medium text-brand">
                  Ver roadmap →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
