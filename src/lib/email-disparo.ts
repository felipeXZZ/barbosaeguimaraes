import "server-only";

import { enderecoLinhaUnica, site } from "@/content/site";

/**
 * O e-mail que leva a matéria até a lista de divulgação. Fica separado do
 * `mail.ts` de propósito: aquele é o aviso interno de um contato recebido,
 * este vai para fora e precisa de rodapé de identificação e de descadastro.
 */

export interface MateriaDoDisparo {
  assunto: string;
  abertura: string;
  titulo: string;
  resumo: string;
  url: string;
  capa: string;
}

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Página pública onde a pessoa confirma a saída da lista. */
export function enderecoDescadastro(token: string): string {
  return `${site.url}/descadastro?t=${token}`;
}

/**
 * Endereço do cabeçalho List-Unsubscribe. É outro caminho de propósito: o
 * Gmail e o Outlook mandam um POST direto para cá quando a pessoa usa o botão
 * de cancelar inscrição do próprio cliente de e-mail, sem abrir página.
 */
export function enderecoDescadastroUmClique(token: string): string {
  return `${site.url}/api/descadastro?t=${token}`;
}

export function corpoTexto(
  materia: MateriaDoDisparo,
  nome: string,
  token: string,
): string {
  const saudacao = nome ? `Olá, ${nome.split(" ")[0]}.` : "Olá.";

  return [
    saudacao,
    "",
    materia.abertura || "O escritório publicou uma nova matéria.",
    "",
    materia.titulo,
    materia.resumo,
    "",
    `Leia em: ${materia.url}`,
    "",
    "---",
    site.nome,
    enderecoLinhaUnica,
    `Telefone ${site.contato.telefoneFormatado}`,
    "",
    "Você recebeu este e-mail porque seu endereço está na lista de divulgação do escritório.",
    `Para sair da lista: ${enderecoDescadastro(token)}`,
  ].join("\n");
}

export function corpoHtml(
  materia: MateriaDoDisparo,
  nome: string,
  token: string,
): string {
  const saudacao = nome ? `Olá, ${escapar(nome.split(" ")[0])}.` : "Olá.";
  const sair = enderecoDescadastro(token);

  /* HTML de e-mail é assim mesmo: tabela, largura fixa e estilo em cada tag.
     Cliente de e-mail não lê folha de estilo externa nem classe. */
  return `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EF;padding:24px 12px">
  <tr>
    <td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#FFFFFF;border:1px solid #E6DFD3">
        <tr>
          <td style="background:#49040E;padding:20px 28px">
            <span style="font-family:Georgia,'Times New Roman',serif;font-size:18px;color:#FFFFFF">
              ${escapar(site.nomeCurto)}
            </span>
            <span style="display:block;margin-top:4px;font-family:Arial,Helvetica,sans-serif;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#C9A227">
              Advogados Associados
            </span>
          </td>
        </tr>
        ${
          materia.capa
            ? `<tr>
          <td>
            <img src="${escapar(materia.capa)}" alt="" width="600" style="display:block;width:100%;max-width:600px;height:auto;border:0">
          </td>
        </tr>`
            : ""
        }
        <tr>
          <td style="padding:28px">
            <p style="margin:0 0 16px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#4A4A4A">
              ${saudacao}
            </p>
            ${
              materia.abertura
                ? `<p style="margin:0 0 20px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#4A4A4A">${escapar(
                    materia.abertura,
                  ).replace(/\n/g, "<br>")}</p>`
                : ""
            }
            <h1 style="margin:0 0 12px;font-family:Georgia,'Times New Roman',serif;font-size:22px;line-height:1.3;color:#49040E">
              ${escapar(materia.titulo)}
            </h1>
            <p style="margin:0 0 24px;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.6;color:#4A4A4A">
              ${escapar(materia.resumo)}
            </p>
            <a href="${escapar(materia.url)}" style="display:inline-block;background:#49040E;color:#FFFFFF;font-family:Arial,Helvetica,sans-serif;font-size:15px;text-decoration:none;padding:14px 28px">
              Ler a matéria
            </a>
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #E6DFD3;padding:20px 28px">
            <p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:12px;line-height:1.6;color:#4A4A4A">
              <strong>${escapar(site.nome)}</strong><br>
              ${escapar(enderecoLinhaUnica)}<br>
              ${escapar(site.contato.telefoneFormatado)}
            </p>
            <p style="margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:1.6;color:#4A4A4A">
              Você recebeu este e-mail porque seu endereço está na lista de
              divulgação do escritório.
              <a href="${escapar(sair)}" style="color:#49040E">Sair da lista</a>.
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`.trim();
}
