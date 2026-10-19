import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalContact,
  LegalPage,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { TERMS_OF_USE_HREF } from "@/lib/legal";

const description =
  "Saiba quais dados pessoais a Bússola.dev coleta, como eles são usados e protegidos e quais são os seus direitos.";

export const metadata: Metadata = {
  title: "Política de Privacidade | Bússola.dev",
  description,
  openGraph: {
    title: "Política de Privacidade | Bússola.dev",
    description,
  },
};

const SECTIONS: LegalSection[] = [
  {
    id: "coleta-de-dados",
    title: "Dados que coletamos",
    content: (
      <>
        <p>
          Coletamos apenas os dados necessários para oferecer e proteger a
          plataforma:
        </p>
        <ul>
          <li>
            <strong>Lista de espera:</strong> nome, e-mail e área de interesse
            informados por você no formulário de inscrição.
          </li>
          <li>
            <strong>Conta de usuário:</strong> nome, e-mail e senha. A senha
            nunca é armazenada em texto puro, apenas em forma de hash
            criptográfico.
          </li>
          <li>
            <strong>Dados técnicos:</strong> endereço IP e informações básicas
            da requisição, usados para limitar envios repetidos de formulários
            e prevenir abusos, além dos registros técnicos gerados
            automaticamente pela infraestrutura de hospedagem.
          </li>
          <li>
            <strong>Preferências:</strong> a sua escolha sobre o uso de
            cookies, salva no próprio navegador.
          </li>
        </ul>
        <p>
          Não solicitamos dados pessoais sensíveis, como origem racial, saúde,
          religião ou opinião política.
        </p>
      </>
    ),
  },
  {
    id: "finalidade",
    title: "Como usamos os dados",
    content: (
      <>
        <p>Os dados coletados são usados para:</p>
        <ul>
          <li>
            registrar sua inscrição na lista de espera e avisar sobre o
            lançamento e as novidades da plataforma;
          </li>
          <li>
            entender quais áreas de tecnologia mais interessam ao público, para
            priorizar os conteúdos e trilhas;
          </li>
          <li>criar e autenticar sua conta, quando disponível;</li>
          <li>
            manter a segurança da plataforma, prevenindo spam, fraudes e uso
            indevido;
          </li>
          <li>cumprir obrigações legais e regulatórias.</li>
        </ul>
        <p>
          O tratamento segue a Lei Geral de Proteção de Dados (Lei nº
          13.709/2018 — LGPD) e se apoia, conforme o caso, no seu
          consentimento, na execução dos serviços que você solicitou, no
          legítimo interesse em manter a plataforma segura e no cumprimento de
          obrigações legais.
        </p>
      </>
    ),
  },
  {
    id: "cookies",
    title: "Cookies e armazenamento local",
    content: (
      <>
        <p>
          Cookies são pequenos arquivos salvos pelo navegador. Atualmente, a
          Bússola.dev utiliza:
        </p>
        <ul>
          <li>
            <strong>Cookies essenciais:</strong> necessários para o login e a
            segurança da sessão (por exemplo, identificação da sessão e
            proteção contra requisições forjadas). Sem eles, áreas que exigem
            autenticação não funcionam.
          </li>
          <li>
            <strong>Armazenamento local do navegador:</strong> usado para
            lembrar se você aceitou ou recusou os cookies, evitando que o aviso
            apareça a cada visita.
          </li>
        </ul>
        <p>
          Hoje não utilizamos cookies de publicidade. Caso passemos a usar
          cookies de análise ou de marketing, esta política será atualizada e,
          quando exigido, pediremos o seu consentimento antes.
        </p>
        <p>
          Você pode apagar ou bloquear cookies nas configurações do seu
          navegador. Bloquear cookies essenciais pode impedir o funcionamento
          de algumas partes da plataforma.
        </p>
      </>
    ),
  },
  {
    id: "armazenamento-e-seguranca",
    title: "Armazenamento e segurança",
    content: (
      <>
        <p>
          Os dados são guardados em serviços de banco de dados e hospedagem com
          acesso restrito. Adotamos medidas técnicas e organizacionais para
          protegê-los, como armazenamento de senhas apenas em hash, controle de
          acesso aos sistemas e limitação de tentativas de envio.
        </p>
        <p>
          Mantemos os dados pelo tempo necessário para cumprir as finalidades
          descritas nesta política — por exemplo, enquanto você estiver na
          lista de espera ou mantiver uma conta ativa — ou pelo prazo exigido
          por lei. Depois disso, eles são excluídos ou anonimizados.
        </p>
        <p>
          Nenhum sistema é totalmente imune a falhas. Se ocorrer um incidente
          de segurança que possa gerar risco aos titulares, comunicaremos os
          afetados e as autoridades competentes, conforme a legislação.
        </p>
      </>
    ),
  },
  {
    id: "compartilhamento",
    title: "Compartilhamento de dados",
    content: (
      <>
        <p>
          <strong>Não vendemos nem alugamos seus dados pessoais.</strong> Eles
          podem ser compartilhados apenas:
        </p>
        <ul>
          <li>
            com prestadores de serviço que nos ajudam a operar a plataforma,
            como hospedagem, banco de dados e proteção contra abuso, que só
            podem usar os dados para executar esses serviços;
          </li>
          <li>
            quando houver obrigação legal, ordem judicial ou pedido de
            autoridade competente;
          </li>
          <li>com o seu consentimento, para outras finalidades específicas.</li>
        </ul>
        <p>
          Alguns desses prestadores podem armazenar dados fora do Brasil. Nesses
          casos, a transferência segue as garantias previstas na LGPD.
        </p>
      </>
    ),
  },
  {
    id: "direitos",
    title: "Seus direitos",
    content: (
      <>
        <p>Como titular dos dados, você pode, a qualquer momento:</p>
        <ul>
          <li>confirmar se tratamos seus dados e acessá-los;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>
            pedir a anonimização, o bloqueio ou a exclusão de dados
            desnecessários ou tratados em desconformidade com a lei;
          </li>
          <li>solicitar a portabilidade dos dados;</li>
          <li>
            saber com quem seus dados foram compartilhados;
          </li>
          <li>
            revogar o consentimento e pedir a exclusão dos dados tratados com
            base nele, como sair da lista de espera;
          </li>
          <li>
            apresentar reclamação à Autoridade Nacional de Proteção de Dados
            (ANPD).
          </li>
        </ul>
        <p>
          Para exercer esses direitos, entre em contato pelos canais indicados
          na seção de contato. Poderemos pedir informações para confirmar sua
          identidade antes de atender à solicitação.
        </p>
      </>
    ),
  },
  {
    id: "contato",
    title: "Contato",
    content: (
      <p>
        Dúvidas, pedidos ou reclamações sobre esta política ou sobre o
        tratamento dos seus dados podem ser enviados por <LegalContact />.
      </p>
    ),
  },
  {
    id: "atualizacoes",
    title: "Atualizações desta política",
    content: (
      <>
        <p>
          Esta política pode ser atualizada para refletir mudanças na
          plataforma ou na legislação. A data da última atualização fica
          sempre no topo desta página. Em mudanças relevantes, avisaremos pelos
          canais disponíveis, como o e-mail cadastrado.
        </p>
        <p>
          O uso da plataforma também é regido pelos{" "}
          <Link href={TERMS_OF_USE_HREF}>Termos de Uso</Link>.
        </p>
      </>
    ),
  },
];

export default function PoliticaDePrivacidade() {
  return (
    <LegalPage
      title="Política de Privacidade"
      intro={
        <p>
          Esta política explica como a Bússola.dev coleta, usa, armazena e
          protege os dados pessoais de quem visita o site, entra na lista de
          espera ou utiliza a plataforma, e quais são os seus direitos sobre
          esses dados.
        </p>
      }
      sections={SECTIONS}
      related={{ href: TERMS_OF_USE_HREF, label: "Termos de Uso" }}
    />
  );
}
