import type { Metadata } from "next";
import Link from "next/link";
import {
  LegalContact,
  LegalPage,
  type LegalSection,
} from "@/components/legal/LegalPage";
import { TERMS_OF_USE_HREF } from "@/lib/legal";

const description =
  "Saiba quais dados pessoais a Bússola.dev coleta, para quê, por quanto tempo e como exercer os seus direitos.";

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
    id: "dados-coletados",
    title: "Dados coletados",
    content: (
      <>
        <p>
          Coletamos apenas os dados necessários para oferecer e proteger a
          plataforma:
        </p>
        <ul>
          <li>
            <strong>Lista de espera:</strong> nome, e-mail e área de interesse,
            informados por você no formulário de inscrição, junto com a data do
            cadastro.
          </li>
          <li>
            <strong>Conta de usuário (quando o login for lançado):</strong>{" "}
            nome, e-mail e senha. A senha nunca é guardada em texto puro, apenas
            como hash criptográfico (bcrypt).
          </li>
          <li>
            <strong>Endereço IP:</strong> usado no envio do formulário para
            limitar tentativas repetidas e impedir cadastros automatizados.
          </li>
          <li>
            <strong>Preferência de cookies:</strong> a sua escolha de aceitar
            ou recusar cookies, salva no próprio navegador.
          </li>
        </ul>
        <p>
          Não coletamos dados pessoais sensíveis, como origem racial, saúde,
          religião ou opinião política, nem dados de pagamento.
        </p>
      </>
    ),
  },
  {
    id: "finalidade-e-base-legal",
    title: "Finalidade e base legal",
    content: (
      <>
        <p>
          O tratamento segue a Lei Geral de Proteção de Dados (Lei nº
          13.709/2018 — LGPD). Cada dado tem uma finalidade e uma base legal:
        </p>
        <ul>
          <li>
            <strong>Nome, e-mail e área de interesse</strong> — registrar sua
            inscrição, avisar sobre o lançamento e entender quais áreas mais
            interessam ao público. Base legal: <strong>consentimento</strong>{" "}
            (art. 7º, I), dado ao marcar o aceite no formulário.
          </li>
          <li>
            <strong>Dados da conta</strong> — criar e autenticar o seu acesso.
            Base legal: <strong>execução de contrato</strong> (art. 7º, V), ou
            seja, prestar o serviço que você solicitou.
          </li>
          <li>
            <strong>Endereço IP</strong> — prevenir spam, fraudes e abuso do
            formulário. Base legal: <strong>legítimo interesse</strong> (art.
            7º, IX) em manter a plataforma segura.
          </li>
        </ul>
        <p>
          <strong>Por quanto tempo guardamos:</strong> os dados da lista de
          espera ficam armazenados até o lançamento da plataforma ou até você
          pedir a exclusão, o que ocorrer primeiro; os dados da conta, enquanto
          ela estiver ativa; e o endereço IP é mantido apenas pela janela de
          controle de tentativas, de poucos minutos. Depois disso, os dados
          são excluídos ou anonimizados, salvo quando a lei exigir sua guarda.
        </p>
      </>
    ),
  },
  {
    id: "cookies-e-analytics",
    title: "Cookies e analytics",
    content: (
      <>
        <p>
          Cookies são pequenos arquivos salvos pelo navegador. A Bússola.dev
          utiliza:
        </p>
        <ul>
          <li>
            <strong>Cookies essenciais de autenticação:</strong> quando o login
            estiver disponível, servirão para manter a sua sessão e proteger
            contra requisições forjadas. Sem eles, o login não funciona.
          </li>
          <li>
            <strong>Armazenamento local do navegador:</strong> guarda se você
            aceitou ou recusou os cookies, para o aviso não aparecer a cada
            visita.
          </li>
        </ul>
        <p>
          <strong>
            Atualmente não usamos ferramentas de analytics nem cookies de
            publicidade.
          </strong>{" "}
          Se passarmos a usar algum serviço de métricas de acesso, esta
          política será atualizada antes, informando qual ferramenta, quais
          dados ela coleta, e pediremos o seu consentimento quando exigido.
        </p>
        <p>
          Você pode apagar ou bloquear cookies nas configurações do navegador.
          Bloquear os essenciais pode impedir o login.
        </p>
      </>
    ),
  },
  {
    id: "compartilhamento-com-terceiros",
    title: "Compartilhamento com terceiros",
    content: (
      <>
        <p>
          <strong>Não vendemos nem alugamos seus dados pessoais.</strong> Para
          funcionar, a plataforma depende de prestadores de serviço que tratam
          dados apenas em nosso nome:
        </p>
        <ul>
          <li>
            <strong>Provedor de banco de dados PostgreSQL:</strong> armazena os
            dados da lista de espera e das contas.
          </li>
          <li>
            <strong>Upstash (Redis):</strong> recebe o endereço IP para
            controlar o limite de envios do formulário.
          </li>
          <li>
            <strong>Provedor de hospedagem:</strong> executa o site e pode
            gerar registros técnicos de acesso.
          </li>
        </ul>
        <p>
          Alguns desses serviços podem armazenar dados fora do Brasil, com as
          garantias previstas na LGPD para transferência internacional. Os
          dados também podem ser compartilhados por obrigação legal ou ordem de
          autoridade competente.
        </p>
      </>
    ),
  },
  {
    id: "direitos-do-titular",
    title: "Direitos do titular",
    content: (
      <>
        <p>
          Pelo art. 18 da LGPD, você pode, a qualquer momento e sem custo:
        </p>
        <ul>
          <li>confirmar se tratamos seus dados e acessá-los;</li>
          <li>corrigir dados incompletos, inexatos ou desatualizados;</li>
          <li>
            pedir a anonimização, o bloqueio ou a exclusão de dados
            desnecessários ou tratados em desconformidade com a lei;
          </li>
          <li>solicitar a portabilidade dos dados;</li>
          <li>saber com quem seus dados foram compartilhados;</li>
          <li>
            revogar o consentimento e pedir a exclusão dos dados tratados com
            base nele — por exemplo, sair da lista de espera;
          </li>
          <li>
            apresentar reclamação à Autoridade Nacional de Proteção de Dados
            (ANPD).
          </li>
        </ul>
        <p>
          Para exercer esses direitos, use o contato indicado abaixo. Podemos
          pedir informações para confirmar sua identidade antes de atender.
        </p>
      </>
    ),
  },
  {
    id: "contato-do-responsavel",
    title: "Contato do responsável",
    content: (
      <>
        <p>
          A Bússola.dev é um projeto acadêmico desenvolvido por João Victor
          Aparecido, Fernando Dias e Gustavo André, que são os responsáveis
          pelo tratamento dos dados descritos nesta política.
        </p>
        <p>
          Dúvidas, pedidos ou reclamações sobre seus dados podem ser enviados
          por <LegalContact />.
        </p>
      </>
    ),
  },
  {
    id: "atualizacoes",
    title: "Atualizações desta política",
    content: (
      <>
        <p>
          Esta política pode mudar para refletir novos recursos ou mudanças na
          legislação. A data da última atualização fica sempre no topo desta
          página, e mudanças relevantes serão avisadas pelo e-mail cadastrado.
        </p>
        <p>
          O uso da plataforma também é regido pelos{" "}
          <Link href={TERMS_OF_USE_HREF}>Termos de Uso</Link>.
        </p>
      </>
    ),
  },
];

export default function Privacidade() {
  return (
    <LegalPage
      title="Política de Privacidade"
      intro={
        <p>
          Esta política explica quais dados pessoais a Bússola.dev coleta de
          quem visita o site e entra na lista de espera, para que eles são
          usados, por quanto tempo ficam guardados e como você pode exercer os
          seus direitos.
        </p>
      }
      sections={SECTIONS}
      related={{ href: TERMS_OF_USE_HREF, label: "Termos de Uso" }}
    />
  );
}
