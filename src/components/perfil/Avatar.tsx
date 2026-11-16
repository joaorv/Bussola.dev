export function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  const primeira = partes[0]?.[0] ?? "";
  const ultima = partes.length > 1 ? partes[partes.length - 1][0] : "";
  return (primeira + ultima).toUpperCase();
}

type Props = {
  nome: string;
  fotoUrl: string | null;
  className?: string;
};

// Foto do perfil ou, sem foto, as iniciais do nome. O tamanho e as cores vêm
// de `className` (ex.: "h-16 w-16 text-xl bg-night-soft").
export function Avatar({ nome, fotoUrl, className = "" }: Props) {
  if (fotoUrl) {
    return (
      // <img> e não next/image: a foto vem de uma rota autenticada e já chega
      // recortada e reduzida, então não há o que otimizar.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fotoUrl}
        alt={`Foto de ${nome}`}
        className={`shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${className}`}
    >
      {iniciais(nome)}
    </span>
  );
}
