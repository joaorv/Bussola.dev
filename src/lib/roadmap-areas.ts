// Roadmap sugerido para cada área do formulário da lista de espera. Áreas sem
// correspondência (ou "Outro") caem na lista com todos os roadmaps. Fica fora
// de roadmaps.ts para o formulário (client) não carregar o JSON inteiro.
const ROADMAP_POR_AREA: Record<string, string> = {
  "Dados e IA": "analista-de-dados",
  Backend: "desenvolvedor-backend",
  "Banco de Dados": "desenvolvedor-backend",
  DevOps: "desenvolvedor-backend",
  "Desenvolvimento Web": "desenvolvedor-fullstack",
  Frontend: "desenvolvedor-fullstack",
};

// Com várias áreas marcadas, leva ao roadmap da primeira que tiver
// correspondência (na ordem em que foram marcadas).
export function roadmapIdForAreas(areas: string[]): string | undefined {
  return areas.map((area) => ROADMAP_POR_AREA[area]).find(Boolean);
}

export function roadmapHrefForAreas(areas: string[]): string {
  const id = roadmapIdForAreas(areas);
  return id ? `/roadmaps/${id}` : "/roadmaps";
}
