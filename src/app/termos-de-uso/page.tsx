import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalContact,
  LegalPage,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { PRIVACY_POLICY_HREF } from "@/lib/legal";

const description =
  "Conheça as regras de uso da Bússola.dev, as responsabilidades de usuários e da plataforma e as condições do serviço.";

export const metadata: Metadata = {
  title: "Termos de Uso | Bússola.dev",
  description,
  openGraph: {
    title: "Termos de Uso | Bússola.dev",
    description,
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "aceitacao",
    title: "Aceitação dos termos",
    content: (
      <>
        <p>
          Ao acessar o site, entrar na lista de espera ou criar uma conta na
          Bússola.dev, você declara que leu, entendeu e concorda com estes
          Termos de Uso e com a{" "}
          <Link href={PRIVACY_POLICY_HREF}>Política de Privacidade</Link>.
        </p>
        <p>Se não concordar com algum ponto, não utilize a plataforma.</p>
      </>
    ),
  },
  {
    id: "sobre-a-plataforma",
    title: "Sobre a plataforma",
    content: (
      <p>
        A Bússola.dev é uma plataforma de orientação de carreira em tecnologia
        que organiza trilhas de estudo e as conecta a cursos, empresas, eventos
        e comunidades da sua região. A plataforma está em desenvolvimento, e
        recursos podem ser lançados, alterados ou removidos ao longo do tempo.
      </p>
    ),
  },
  {
    id: "uso-permitido",
    title: "Uso permitido da plataforma",
    content: (
      <>
        <p>
          Você pode usar a plataforma para fins pessoais e de aprendizado. Não
          é permitido:
        </p>
        <ul>
          <li>fornecer dados falsos ou se passar por outra pessoa;</li>
          <li>
            enviar cadastros automatizados, spam ou conteúdo malicioso;
          </li>
          <li>
            tentar acessar áreas restritas, contas de terceiros ou sistemas da
            plataforma sem autorização;
          </li>
          <li>
            interferir no funcionamento do serviço, por exemplo sobrecarregando
            servidores ou contornando mecanismos de segurança;
          </li>
          <li>
            copiar, extrair em massa ou revender o conteúdo da plataforma sem
            autorização;
          </li>
          <li>usar a plataforma para qualquer fim ilegal.</li>
        </ul>
      </>
    ),
  },
  {
    id: "responsabilidades-do-usuario",
    title: "Responsabilidades do usuário",
    content: (
      <ul>
        <li>Manter seus dados de cadastro corretos e atualizados.</li>
        <li>
          Guardar sua senha em sigilo e avisar a plataforma se suspeitar de uso
          indevido da sua conta.
        </li>
        <li>
          Responder pelas atividades realizadas com a sua conta.
        </li>
        <li>Respeitar estes termos e a legislação aplicável.</li>
      </ul>
    ),
  },
  {
    id: "responsabilidades-da-plataforma",
    title: "Responsabilidades da plataforma",
    content: (
      <ul>
        <li>
          Tratar seus dados pessoais conforme a{" "}
          <Link href={PRIVACY_POLICY_HREF}>Política de Privacidade</Link> e a
          LGPD.
        </li>
        <li>
          Adotar medidas razoáveis de segurança para proteger a plataforma e as
          informações dos usuários.
        </li>
        <li>
          Manter as informações publicadas o mais corretas e atualizadas
          possível.
        </li>
        <li>Comunicar alterações relevantes nestes termos.</li>
      </ul>
    ),
  },
  {
    id: "propriedade-intelectual",
    title: "Propriedade intelectual",
    content: (
      <>
        <p>
          A marca Bússola.dev, o logotipo, o layout, os textos, as trilhas e
          demais conteúdos próprios da plataforma são protegidos por direitos
          de propriedade intelectual e não podem ser reproduzidos, modificados
          ou distribuídos sem autorização prévia.
        </p>
        <p>
          Marcas, nomes e conteúdos de terceiros citados na plataforma, como
          cursos, empresas e eventos, pertencem aos seus respectivos titulares.
        </p>
      </>
    ),
  },
  {
    id: "limitacao-de-responsabilidade",
    title: "Limitações de responsabilidade",
    content: (
      <>
        <p>
          O conteúdo da Bússola.dev tem caráter informativo e de orientação. A
          plataforma não garante a obtenção de emprego, aprovação em processos
          seletivos ou resultados específicos de carreira.
        </p>
        <p>
          Cursos, empresas, eventos e comunidades indicados são de
          responsabilidade de seus organizadores. A Bússola.dev não se
          responsabiliza pelo conteúdo, pela disponibilidade ou pelas práticas
          de sites e serviços de terceiros acessados a partir da plataforma.
        </p>
        <p>
          Na extensão permitida pela lei, a Bússola.dev não responde por danos
          indiretos decorrentes do uso ou da impossibilidade de uso da
          plataforma. Nada nestes termos limita direitos garantidos ao
          consumidor pela legislação brasileira.
        </p>
      </>
    ),
  },
  {
    id: "disponibilidade",
    title: "Disponibilidade do serviço",
    content: (
      <p>
        Buscamos manter a plataforma disponível de forma contínua, mas ela pode
        passar por interrupções para manutenção, atualizações ou por falhas
        técnicas e de terceiros. Funcionalidades podem ser modificadas,
        suspensas ou encerradas, e sempre que possível avisaremos com
        antecedência sobre mudanças relevantes.
      </p>
    ),
  },
  {
    id: "alteracoes",
    title: "Alterações dos termos",
    content: (
      <p>
        Estes termos podem ser atualizados a qualquer momento. A data da última
        atualização fica sempre no topo desta página, e mudanças relevantes
        serão comunicadas pelos canais disponíveis. Continuar usando a
        plataforma após a atualização significa concordar com a nova versão.
      </p>
    ),
  },
  {
    id: "legislacao",
    title: "Legislação aplicável",
    content: (
      <p>
        Estes termos são regidos pelas leis da República Federativa do Brasil.
        Eventuais conflitos serão resolvidos no foro previsto na legislação
        aplicável, garantido ao consumidor o foro do seu domicílio.
      </p>
    ),
  },
  {
    id: "contato",
    title: "Contato",
    content: (
      <p>
        Dúvidas sobre estes termos podem ser enviadas por <LegalContact />.
      </p>
    ),
  },
];

export default function TermosDeUso() {
  return (
    <LegalPage
      title="Termos de Uso"
      intro={
        <p>
          Estes termos definem as regras para o uso da Bússola.dev, incluindo o
          site, a lista de espera e os recursos da plataforma. Leia com atenção
          antes de utilizar o serviço.
        </p>
      }
      sections={SECTIONS}
      related={{ href: PRIVACY_POLICY_HREF, label: "Política de Privacidade" }}
    />
  );
}
