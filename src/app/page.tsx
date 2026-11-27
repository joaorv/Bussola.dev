import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { ComecarAgora } from "@/components/home/ComecarAgora";
import { getSession } from "@/lib/auth";

export default async function Home() {
  // Lido no servidor para os botões já chegarem certos, sem piscar.
  const logado = !!(await getSession());

  return (
    <>
      <Hero logado={logado} />
      <HowItWorks />
      <ComecarAgora logado={logado} />
    </>
  );
}
