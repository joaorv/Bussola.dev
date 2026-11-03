// Data de lançamento: usada pelo contador da home e pelo cron que envia o
// e-mail de lançamento para a lista de espera.
export const LAUNCH_DATE =
  process.env.NEXT_PUBLIC_LAUNCH_DATE ?? "2026-11-30T00:00:00-03:00";
