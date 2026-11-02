import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LAUNCH_DATE } from "@/lib/launch";
import { mailer, remetente } from "@/lib/mailer";
import { emailLancamento } from "@/lib/emails/lancamento";

// Envia o e-mail de lançamento para a lista de espera.
//
// Chamado pelo Vercel Cron (vercel.json), que manda o header
// "Authorization: Bearer <CRON_SECRET>". Também pode ser chamado na mão com o
// mesmo header:
//   ?para=email@exemplo.com  envia só um e-mail de teste para esse endereço
//   ?forcar=1                envia mesmo antes da data de lançamento
//
// Cada lead enviado é marcado em emailLancamentoEnviadoEm, então rodar de novo
// só pega quem ainda não recebeu (inclusive quem falhou na rodada anterior).

export const maxDuration = 300;

const ENVIOS_SIMULTANEOS = 3;
// Para de pegar leads novos com folga antes do maxDuration; o que sobrar sai
// na próxima chamada.
const TEMPO_LIMITE_MS = 240_000;

function urlDoSite() {
  return (process.env.NEXTAUTH_URL ?? "https://bussola-dev.vercel.app").replace(/\/$/, "");
}

async function enviar(para: string, nome: string, areaInteresse: string) {
  const { assunto, texto, html } = emailLancamento({
    nome,
    areaInteresse,
    siteUrl: urlDoSite(),
  });

  await mailer.sendMail({
    from: remetente,
    to: para,
    subject: assunto,
    text: texto,
    html,
    list: {
      unsubscribe: {
        url: `mailto:${process.env.GMAIL_USER}?subject=Remover da lista`,
        comment: "Remover da lista",
      },
    },
  });
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);

  const emailTeste = searchParams.get("para");
  if (emailTeste) {
    try {
      await enviar(emailTeste, "Fulano de Tal", "Desenvolvimento Web");
      return NextResponse.json({ status: "teste enviado", para: emailTeste });
    } catch (error) {
      console.error("Erro ao enviar e-mail de teste:", error);
      return NextResponse.json(
        { error: "Falha ao enviar o e-mail de teste" },
        { status: 500 }
      );
    }
  }

  const forcar = searchParams.get("forcar") === "1";
  if (!forcar && Date.now() < new Date(LAUNCH_DATE).getTime()) {
    return NextResponse.json({ status: "aguardando lançamento", lancamento: LAUNCH_DATE });
  }

  const leads = await prisma.lead.findMany({
    where: { emailLancamentoEnviadoEm: null },
    orderBy: { id: "asc" },
    select: { id: true, nome: true, email: true, areaInteresse: true },
  });

  const inicio = Date.now();
  let proximo = 0;
  let enviados = 0;
  let falhas = 0;

  async function trabalhador() {
    while (proximo < leads.length && Date.now() - inicio < TEMPO_LIMITE_MS) {
      const lead = leads[proximo++];
      try {
        await enviar(lead.email, lead.nome, lead.areaInteresse);
        await prisma.lead.update({
          where: { id: lead.id },
          data: { emailLancamentoEnviadoEm: new Date() },
        });
        enviados++;
      } catch (error) {
        falhas++;
        console.error(`Erro ao enviar e-mail de lançamento (lead ${lead.id}):`, error);
      }
    }
  }

  await Promise.all(Array.from({ length: ENVIOS_SIMULTANEOS }, trabalhador));

  const resultado = {
    status: "concluído",
    enviados,
    falhas,
    naoProcessados: leads.length - proximo,
  };
  console.log("E-mail de lançamento:", resultado);

  return NextResponse.json(resultado);
}
