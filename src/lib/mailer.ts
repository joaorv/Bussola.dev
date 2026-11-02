import nodemailer from "nodemailer";

// Envio pelo SMTP do Gmail. GMAIL_APP_PASSWORD é uma "senha de app" do Google
// (exige verificação em duas etapas na conta), não a senha normal do Gmail.
// O pool reaproveita as conexões; mais de 3 simultâneas o Gmail costuma barrar.
export const mailer = nodemailer.createTransport({
  service: "gmail",
  pool: true,
  maxConnections: 3,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const remetente = `"Bússola.dev" <${process.env.GMAIL_USER}>`;
