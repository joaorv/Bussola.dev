// Fonte única dos Termos de Uso: versão, data e texto.
//
// Ao alterar o texto, suba CURRENT_TERMS_VERSION (ex.: "1.0" -> "1.1") e
// atualize TERMS_UPDATED_AT. Novas inscrições passam a registrar a versão
// nova; as aceitações antigas continuam no banco (tabela TermsAcceptance),
// então dá para saber quais leads ainda não aceitaram a versão vigente.

export const CURRENT_TERMS_VERSION = "1.0";

/** Data da última atualização do texto (AAAA-MM-DD). */
export const TERMS_UPDATED_AT = "2026-10-01";

export const TERMS_CHECKBOX_LABEL = "Li e concordo com os Termos de Uso.";

export type TermsSection = {
  title: string;
  paragraphs: string[];
};

export const TERMS_SECTIONS: TermsSection[] = [
  {
    title: "1. Aceitação dos termos",
    paragraphs: [
      "Ao entrar na lista de espera ou utilizar a Bússola.dev, você declara que leu, entendeu e concorda com estes Termos de Uso. Caso não concorde com alguma condição, não utilize a plataforma.",
      "Quando estes termos forem atualizados, a nova versão será publicada nesta página, com a data e o número da versão, e poderemos solicitar uma nova aceitação.",
    ],
  },
  {
    title: "2. Sobre a plataforma",
    paragraphs: [
      "A Bússola.dev oferece trilhas, conteúdos e orientações para apoiar quem deseja iniciar ou evoluir na carreira de tecnologia. O conteúdo tem caráter educativo e informativo e não garante contratação, promoção ou qualquer resultado profissional específico.",
    ],
  },
  {
    title: "3. Lista de espera",
    paragraphs: [
      "Para entrar na lista de espera, informe dados verdadeiros e atualizados. Usaremos seu nome, e-mail e área de interesse para avisar sobre o lançamento e enviar novidades da Bússola.dev.",
      "Você pode pedir para sair da lista a qualquer momento pelos nossos canais de contato.",
    ],
  },
  {
    title: "4. Uso adequado",
    paragraphs: [
      "Você se compromete a não utilizar a plataforma para fins ilegais, a não tentar acessar áreas ou dados sem autorização, a não interferir no funcionamento do serviço e a não publicar conteúdo ofensivo, discriminatório ou que viole direitos de terceiros.",
      "O descumprimento destas regras pode levar à remoção do seu cadastro.",
    ],
  },
  {
    title: "5. Propriedade intelectual",
    paragraphs: [
      "Marcas, textos, trilhas, imagens e demais materiais da Bússola.dev são protegidos por direitos de propriedade intelectual. Você pode utilizá-los para seu aprendizado pessoal, mas não pode reproduzi-los, distribuí-los ou comercializá-los sem autorização prévia.",
    ],
  },
  {
    title: "6. Privacidade e dados pessoais",
    paragraphs: [
      "Tratamos seus dados pessoais de acordo com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Coletamos apenas as informações necessárias para oferecer o serviço, como nome, e-mail e preferências de área, e não as vendemos a terceiros.",
      "Você pode solicitar a qualquer momento acesso, correção ou exclusão dos seus dados pelos nossos canais de contato.",
    ],
  },
  {
    title: "7. Disponibilidade e alterações do serviço",
    paragraphs: [
      "Trabalhamos para manter a plataforma disponível e funcionando bem, mas podem ocorrer interrupções para manutenção, atualizações ou por motivos fora do nosso controle. Recursos podem ser adicionados, alterados ou removidos ao longo do tempo.",
    ],
  },
  {
    title: "8. Limitação de responsabilidade",
    paragraphs: [
      "A Bússola.dev não se responsabiliza por decisões tomadas com base no conteúdo da plataforma, nem por conteúdos de sites de terceiros indicados como referência.",
    ],
  },
  {
    title: "9. Contato",
    paragraphs: [
      "Dúvidas sobre estes Termos de Uso podem ser enviadas pela nossa página de contato.",
    ],
  },
];

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "2026-10-01" -> "01 de outubro de 2026" */
export function formatTermsDate(isoDate: string) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`));
}
