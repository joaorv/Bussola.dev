import { LEVEL_LABELS, type TopicLevel } from "@/lib/roadmaps";

// Essencial usa o destaque (agulha da bússola), recomendado a cor da marca e
// opcional fica neutro. O verde (success) fica reservado para progresso.
const LEVEL_CLASS: Record<TopicLevel, string> = {
  required: "border-accent/30 bg-accent/10 text-accent-active dark:text-accent-hover",
  recommended: "border-brand/30 bg-brand/10 text-brand",
  optional: "border-border bg-ink-100 text-muted",
};

export function LevelBadge({ level }: { level: TopicLevel }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${LEVEL_CLASS[level]}`}
    >
      {LEVEL_LABELS[level]}
    </span>
  );
}
