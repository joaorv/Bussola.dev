// E-mail de lançamento enviado para quem entrou na lista de espera.
// HTML com tabelas e estilos inline, que é o que os clientes de e-mail
// (Gmail, Outlook, Apple Mail) renderizam de forma consistente.

type DadosLancamento = {
  nome: string;
  areaInteresse: string;
  siteUrl: string;
};

const cores = {
  fundo: "#F7F8FA",
  superficie: "#FFFFFF",
  noite: "#14213D",
  texto: "#38455C",
  textoFraco: "#64748B",
  borda: "#EEF1F6",
  destaque: "#E4572E",
};

function escaparHtml(valor: string) {
  return valor
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function emailLancamento({ nome, areaInteresse, siteUrl }: DadosLancamento) {
  const primeiroNome = nome.trim().split(/\s+/)[0];
  const nomeHtml = escaparHtml(primeiroNome);
  const areaHtml = escaparHtml(areaInteresse);
  const privacidadeUrl = `${siteUrl}/privacidade`;

  const assunto = `${primeiroNome}, a Bússola.dev chegou! 🧭`;

  const texto = `Oi, ${primeiroNome}!

A espera acabou: a Bússola.dev está no ar.

Você entrou na lista de espera interessado(a) em ${areaInteresse}. Agora já dá para montar sua trilha de carreira em tecnologia, com cursos, empresas, eventos e comunidades perto de você.

Acesse: ${siteUrl}

Obrigado por acreditar no projeto desde o começo.
Equipe Bússola.dev

---
Você recebeu este e-mail porque se cadastrou na lista de espera da Bússola.dev. Para não receber mais, é só responder este e-mail pedindo a remoção.
Política de privacidade: ${privacidadeUrl}`;

  const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escaparHtml(assunto)}</title>
</head>
<body style="margin:0;padding:0;background:${cores.fundo};font-family:Arial,Helvetica,sans-serif;">
<div style="display:none;max-height:0;overflow:hidden;">A espera acabou: sua trilha em ${areaHtml} já está te esperando.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${cores.fundo};">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:${cores.superficie};border-radius:12px;overflow:hidden;border:1px solid ${cores.borda};">
        <tr>
          <td style="background:${cores.noite};padding:28px 32px;">
            <span style="font-size:22px;font-weight:bold;color:#FFFFFF;">🧭 Bússola<span style="color:${cores.destaque};">.dev</span></span>
          </td>
        </tr>
        <tr>
          <td style="padding:36px 32px 8px;">
            <h1 style="margin:0 0 16px;font-size:26px;line-height:1.3;color:${cores.noite};">Oi, ${nomeHtml}! A espera acabou.</h1>
            <p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${cores.texto};">
              A <strong>Bússola.dev</strong> está no ar. Você entrou na lista de espera interessado(a) em
              <strong style="color:${cores.noite};">${areaHtml}</strong>, e agora já dá para montar a sua trilha de carreira em tecnologia,
              com cursos, empresas, eventos e comunidades perto de você.
            </p>
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:16px 32px 32px;">
            <a href="${siteUrl}" style="display:inline-block;background:${cores.destaque};color:#FFFFFF;text-decoration:none;font-size:16px;font-weight:bold;padding:14px 32px;border-radius:8px;">Acessar a Bússola.dev</a>
          </td>
        </tr>
        <tr>
          <td style="padding:0 32px 32px;">
            <p style="margin:0;font-size:16px;line-height:1.6;color:${cores.texto};">
              Obrigado por acreditar no projeto desde o começo.<br>
              <strong style="color:${cores.noite};">Equipe Bússola.dev</strong>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:20px 32px;border-top:1px solid ${cores.borda};">
            <p style="margin:0;font-size:12px;line-height:1.6;color:${cores.textoFraco};">
              Você recebeu este e-mail porque se cadastrou na lista de espera da Bússola.dev.
              Para não receber mais, é só responder este e-mail pedindo a remoção.
              <a href="${privacidadeUrl}" style="color:${cores.textoFraco};">Política de privacidade</a>.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  return { assunto, texto, html };
}
