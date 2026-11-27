import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

// Cookie gravado quando a pessoa entra na lista de espera. Ele libera os
// roadmaps neste navegador; não é autenticação, só um "já fez o pré-cadastro".
export const LEAD_COOKIE = "bussola_lead";

const UM_ANO = 60 * 60 * 24 * 365;

export function setLeadCookie(response: NextResponse) {
  response.cookies.set(LEAD_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: UM_ANO,
  });

  return response;
}

// Para as páginas de roadmap: libera quem tem conta e está logado, e também
// quem entrou na antiga lista de espera (cookie ainda válido). Os demais vão
// para o cadastro e voltam para `callbackUrl` depois de criar a conta.
export async function requireLeadAccess(callbackUrl: string) {
  const cookieStore = await cookies();

  if (!cookieStore.has(LEAD_COOKIE) && !(await getSession())) {
    redirect(`/cadastro?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
}
