"use client";

import { SessionProvider } from "next-auth/react";

// Dá acesso à sessão (useSession) nos componentes client, como o Header. A
// sessão é buscada no navegador, então as páginas continuam estáticas.
export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
