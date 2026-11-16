import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// No Next 16 o antigo `middleware.ts` passou a se chamar `proxy.ts`. Ele roda
// antes das rotas listadas no `matcher` e manda para o login quem não tem
// sessão. É uma checagem otimista (só confere o JWT do cookie): as páginas e
// rotas de API que leem dados do usuário continuam validando com getSession().
export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (token) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
  const loginUrl = new URL("/login", request.url);

  // Depois do login, a pessoa volta para a página que tentou abrir.
  loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/perfil/:path*", "/trilha/:path*"],
};
