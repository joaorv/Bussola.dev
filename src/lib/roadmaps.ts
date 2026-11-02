import data from "@/data/roadmaps.json";

export type TopicLevel = "required" | "recommended" | "optional";
export type ResourceType = "concept" | "tool" | "framework";

export type Resource = {
  type: ResourceType;
  name: string;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
  level: TopicLevel;
  resources: Resource[];
};

export type Category = {
  id: string;
  name: string;
  order: number;
  topics: Topic[];
};

export type Roadmap = {
  id: string;
  title: string;
  description: string;
  categories: Category[];
};

// O import do JSON infere `level` e `type` como string; o cast fixa os
// literais acima. O conteúdo é estático e revisado junto com o código.
const ROADMAPS = (data.roadmaps as Roadmap[]).map((roadmap) => ({
  ...roadmap,
  categories: [...roadmap.categories].sort((a, b) => a.order - b.order),
}));

export const LEVEL_LABELS: Record<TopicLevel, string> = {
  required: "Essencial",
  recommended: "Recomendado",
  optional: "Opcional",
};

export const RESOURCE_LABELS: Record<ResourceType, string> = {
  concept: "Conceito",
  tool: "Ferramenta",
  framework: "Framework",
};

export function getRoadmaps(): Roadmap[] {
  return ROADMAPS;
}

export function getRoadmap(id: string): Roadmap | undefined {
  return ROADMAPS.find((roadmap) => roadmap.id === id);
}

export function countTopics(roadmap: Roadmap): number {
  return roadmap.categories.reduce((total, c) => total + c.topics.length, 0);
}
