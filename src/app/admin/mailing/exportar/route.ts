import { listarMailingCompleto } from "@/lib/mailing";

/* Rota de painel: depende da sessão em cookie e nunca pode ser cacheada. */
export const dynamic = "force-dynamic";

/** Escapa um campo para CSV: aspas dobradas e o valor entre aspas. */
function campo(valor: string): string {
  return `"${valor.replace(/"/g, '""')}"`;
}

/**
 * Baixa a lista inteira em CSV. O acesso já é barrado pelo middleware do
 * /admin, e as regras do banco só devolvem linhas para quem é editor.
 *
 * Separador ponto e vírgula e BOM no começo: é o que o Excel em português
 * espera para abrir o arquivo em colunas, com acento no lugar certo.
 */
export async function GET() {
  const contatos = await listarMailingCompleto();

  const linhas = [
    [
      "nome",
      "email",
      "telefone",
      "endereco",
      "bairro",
      "cidade",
      "uf",
      "cep",
      "oab",
      "subsecao",
      "observacao",
      "origem",
      "recebe",
      "cadastrado_em",
    ].join(";"),
    ...contatos.map((contato) =>
      [
        campo(contato.nome),
        campo(contato.email),
        campo(contato.telefone),
        campo(contato.endereco),
        campo(contato.bairro),
        campo(contato.cidade),
        campo(contato.uf),
        campo(contato.cep),
        campo(contato.oab),
        campo(contato.subsecao),
        campo(contato.observacao),
        campo(contato.origem),
        campo(contato.ativo ? "sim" : "nao"),
        campo(contato.criadoEm.slice(0, 10)),
      ].join(";"),
    ),
  ];

  const hoje = new Date().toISOString().slice(0, 10);

  return new Response(`﻿${linhas.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="lista-divulgacao-${hoje}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
