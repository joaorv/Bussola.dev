import type { Roadmap, Topic } from "@/lib/roadmaps";

export type ProgressoEtapa = {
  id: string;
  nome: string;
  concluidos: number;
  total: number;
};

export type ResumoProgresso = {
  roadmap: Roadmap;
  concluidos: number;
  total: number;
  percentual: number;
  etapas: ProgressoEtapa[];
  // Primeiro tópico ainda não concluído, na ordem da trilha.
  proximoTopico: (Topic & { etapa: string }) | null;
  ultimaAtividade: Date | null;
};

type Concluido = { topicId: string; concluidoEm: Date };

// Junta o conteúdo do roadmap (JSON) com os tópicos que o usuário concluiu
// (banco). Ids que não existem mais no JSON são ignorados.
export function resumirProgresso(roadmap: Roadmap, concluidos: Concluido[]): ResumoProgresso {
  const feitos = new Set(concluidos.map((c) => c.topicId));

  let total = 0;
  let feitosNoRoadmap = 0;
  let proximoTopico: ResumoProgresso["proximoTopico"] = null;

  const etapas = roadmap.categories.map((categoria) => {
    let concluidosEtapa = 0;

    for (const topico of categoria.topics) {
      if (feitos.has(topico.id)) concluidosEtapa++;
      else if (!proximoTopico) proximoTopico = { ...topico, etapa: categoria.name };
    }

    total += categoria.topics.length;
    feitosNoRoadmap += concluidosEtapa;

    return {
      id: categoria.id,
      nome: categoria.name,
      concluidos: concluidosEtapa,
      total: categoria.topics.length,
    };
  });

  const ultimaAtividade = concluidos.reduce<Date | null>(
    (maisRecente, c) => (!maisRecente || c.concluidoEm > maisRecente ? c.concluidoEm : maisRecente),
    null
  );

  return {
    roadmap,
    concluidos: feitosNoRoadmap,
    total,
    percentual: total ? Math.round((feitosNoRoadmap / total) * 100) : 0,
    etapas,
    proximoTopico,
    ultimaAtividade,
  };
}
