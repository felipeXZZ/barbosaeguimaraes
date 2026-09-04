import "server-only";

import { Resend } from "resend";

import { areas } from "@/content/areas";
import { site } from "@/content/site";
import type { DadosContato } from "@/lib/schemas";

/**
 * Integração de e-mail isolada. Para trocar Resend por Nodemailer ou por
 * outro provedor, basta reescrever `enviarEmailContato`. Nada mais no
 * projeto conhece o provedor.
 */

const CHAVE = process.env.RESEND_API_KEY;
const DESTINO = process.env.CONTATO_EMAIL_DESTINO ?? site.contato.email;
const REMETENTE =
  process.env.CONTATO_EMAIL_REMETENTE ?? "site@barbosaeguimaraes.adv.br";

export const envioConfigurado = Boolean(CHAVE);

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function nomeDaArea(valor: string): string {
  return areas.find((area) => area.slug === valor)?.nome ?? "Outro assunto";
}

export async function enviarEmailContato(dados: DadosContato): Promise<void> {
  if (!CHAVE) {
    throw new Error(
      "RESEND_API_KEY não configurada. Defina a variável de ambiente para habilitar o envio.",
    );
  }

  const resend = new Resend(CHAVE);
  const area = nomeDaArea(dados.area);
  const recebidoEm = new Date().toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
  });

  const { error } = await resend.emails.send({
    from: `Site ${site.nomeCurto} <${REMETENTE}>`,
    to: [DESTINO],
    replyTo: dados.email,
    subject: `Contato pelo site: ${area}, ${dados.nome}`,
    text: [
      `Nome: ${dados.nome}`,
      `E-mail: ${dados.email}`,
      `Telefone: ${dados.telefone}`,
      `Área de interesse: ${area}`,
      `Recebido em: ${recebidoEm}`,
      "",
      "Mensagem:",
      dados.mensagem,
      "",
      "Consentimento LGPD registrado no envio do formulário.",
    ].join("\n"),
    html: `
      <h2 style="font-family:Georgia,serif;color:#4A0E11">Contato pelo site</h2>
      <p><strong>Nome:</strong> ${escapar(dados.nome)}</p>
      <p><strong>E-mail:</strong> ${escapar(dados.email)}</p>
      <p><strong>Telefone:</strong> ${escapar(dados.telefone)}</p>
      <p><strong>Área de interesse:</strong> ${escapar(area)}</p>
      <p><strong>Recebido em:</strong> ${escapar(recebidoEm)}</p>
      <hr style="border:0;border-top:1px solid #C9A227">
      <p style="white-space:pre-wrap">${escapar(dados.mensagem)}</p>
      <p style="color:#4A4A4A;font-size:12px">
        Consentimento com a política de privacidade registrado no envio.
      </p>
    `,
  });

  if (error) {
    throw new Error(error.message);
  }
}
