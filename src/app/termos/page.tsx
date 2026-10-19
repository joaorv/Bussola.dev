import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalContact,
  LegalPage,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { PRIVACY_POLICY_HREF } from "@/lib/legal";

const description =
  "Conheça as regras de uso da Bússola.dev, os limites de responsabilidade da plataforma e a propriedade do conteúdo.";

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
      <p>
        Ao acessar o site ou entrar na lista de espera da Bússola.dev, você
        declara que leu e concorda com estes Termos de Uso e com a{" "}
        <Link href={PRIVACY_POLICY_HREF}>Política de Privacidade</Link>. Se não
        concordar, não utilize a plataforma.
      </p>
    ),
  },
  {
    id: "descricao-da-plataforma",
    title: "Descrição da plataforma",
    content: (
      <>
        <p>
          A Bússola.dev é uma plataforma de orientação de carreira em
          tecnologia. Ela organiza roadmaps de estudo em etapas e conecta cada
          etapa a cursos, empresas que contratam, eventos e comunidades da
          região do usuário.
        </p>
        <p>
          Trata-se de um projeto acadêmico em desenvolvimento. Hoje está
          disponível a landing page com a lista de espera; recursos como conta
          de usuário e trilhas serão lançados aos poucos e podem mudar ao
          longo do tempo.
        </p>
      </>
    ),
  },
  {
    id: "regras-de-uso",
    title: "Regras de uso",
    content: (
      <>
        <p>
          A plataforma é destinada a uso pessoal e educacional. Ao utilizá-la,
          você se compromete a:
        </p>
        <ul>
          <li>informar dados verdadeiros e mantê-los atualizados;</li>
          <li>
            manter sua senha em sigilo e responder pelas ações feitas com a sua
            conta, quando ela estiver disponível.
          </li>
        </ul>
        <p>Não é permitido:</p>
        <ul>
          <li>se passar por outra pessoa ou cadastrar dados de terceiros;</li>
          <li>enviar cadastros automatizados, spam ou conteúdo malicioso;</li>
          <li>
            tentar acessar áreas restritas, contas de outros usuários ou
            sistemas da plataforma sem autorização;
          </li>
          <li>
            sobrecarregar o serviço ou contornar seus mecanismos de segurança;
          </li>
          <li>
            copiar em massa ou revender o conteúdo da plataforma sem
            autorização;
          </li>
          <li>usar a plataforma para qualquer fim ilegal.</li>
        </ul>
        <p>
          O descumprimento dessas regras pode levar à remoção do cadastro ou à
          suspensão do acesso.
        </p>
      </>
    ),
  },
  {
    id: "limitacao-de-responsabilidade",
    title: "Limitação de responsabilidade",
    content: (
      <>
        <p>
          <strong>
            Os roadmaps e conteúdos da Bússola.dev são sugestões de
            aprendizado, não promessa de empregabilidade.
          </strong>{" "}
          A plataforma não garante contratação, aprovação em processos
          seletivos ou qualquer resultado específico de carreira — isso depende
          de fatores que estão fora do nosso controle.
        </p>
        <p>
          Cursos, empresas, eventos e comunidades indicados são de
          responsabilidade dos seus organizadores. Não respondemos pelo
          conteúdo, preço, disponibilidade ou práticas de sites e serviços de
          terceiros acessados a partir da plataforma.
        </p>
        <p>
          Buscamos manter o serviço disponível e as informações atualizadas,
          mas a plataforma pode passar por interrupções, falhas ou mudanças sem
          aviso prévio. Na extensão permitida pela lei, não respondemos por
          danos indiretos decorrentes do uso ou da impossibilidade de uso do
          serviço. Nada nestes termos limita direitos garantidos ao consumidor
          pela legislação brasileira.
        </p>
      </>
    ),
  },
  {
    id: "propriedade-do-conteudo",
    title: "Propriedade do conteúdo",
    content: (
      <>
        <p>
          A marca Bússola.dev, o logotipo, o design, os textos e os roadmaps
          criados pela equipe pertencem aos seus autores e não podem ser
          reproduzidos ou redistribuídos sem autorização.
        </p>
        <p>
          Nomes, marcas e materiais de cursos, empresas e eventos citados
          pertencem aos respectivos titulares e aparecem apenas como
          referência.
        </p>
        <p>
          Os dados que você informa continuam sendo seus. Usamos esses dados
          somente nos termos da{" "}
          <Link href={PRIVACY_POLICY_HREF}>Política de Privacidade</Link>.
        </p>
      </>
    ),
  },
  {
    id: "alteracao-dos-termos",
    title: "Alteração dos termos",
    content: (
      <p>
        Estes termos podem ser atualizados conforme a plataforma evolui. A data
        da última atualização fica sempre no topo desta página, e mudanças
        relevantes serão avisadas pelo e-mail cadastrado. Continuar usando a
        plataforma depois da atualização significa concordar com a nova
        versão.
      </p>
    ),
  },
  {
    id: "legislacao-e-contato",
    title: "Legislação e contato",
    content: (
      <p>
        Estes termos são regidos pelas leis brasileiras, garantido ao
        consumidor o foro do seu domicílio. Dúvidas podem ser enviadas por{" "}
        <LegalContact />.
      </p>
    ),
  },
];

export default function Termos() {
  return (
    <LegalPage
      title="Termos de Uso"
      intro={
        <p>
          Estes termos definem as regras para usar a Bússola.dev, incluindo o
          site e a lista de espera. Leia com atenção antes de utilizar o
          serviço.
        </p>
      }
      sections={SECTIONS}
      related={{ href: PRIVACY_POLICY_HREF, label: "Política de Privacidade" }}
    />
  );
}
