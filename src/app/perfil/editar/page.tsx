import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fotoUrl, perfilSelect } from "@/lib/perfil";
import { EditarPerfilForm } from "@/components/perfil/EditarPerfilForm";
import { FotoPerfilEditor } from "@/components/perfil/FotoPerfilEditor";

export const metadata: Metadata = {
  title: "Editar perfil | Bússola.dev",
  description: "Atualize sua foto, profissão, links e áreas de interesse.",
};

export default async function EditarPerfilPage() {
  const session = await getSession();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/perfil/editar");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: perfilSelect,
  });

  if (!user) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-gutter py-section-sm">
      <div>
        <Link href="/perfil" className="text-xs text-muted hover:text-foreground">
          ← Voltar para o perfil
        </Link>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
          Editar perfil
        </h1>
      </div>

      <FotoPerfilEditor nome={user.nome} fotoUrlInicial={fotoUrl(user.fotoAtualizadaEm)} />

      <EditarPerfilForm
        inicial={{
          nome: user.nome,
          profissao: user.profissao ?? "",
          localizacao: user.localizacao ?? "",
          sobre: user.sobre ?? "",
          linkedinUrl: user.linkedinUrl ?? "",
          githubUrl: user.githubUrl ?? "",
          siteUrl: user.siteUrl ?? "",
          areasInteresse: user.areasInteresse,
        }}
      />
    </div>
  );
}
