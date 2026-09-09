"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import {
  analisarLista,
  LIMITE_IMPORTACAO,
  type ContatoImportado,
} from "@/lib/mailing-importar";
import { supabaseServidor } from "@/lib/supabase/servidor";

export type ResultadoMailing =
  | { status: "ok"; mensagem: string }
  | { status: "erro"; mensagem: string };

const SEM_CONEXAO =
  "O painel não está conectado ao Supabase. Confira as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.";

const SEM_TABELA =
  "A tabela da lista ainda não existe no banco. Rode o arquivo supabase/mensagens-e-mailing.sql no SQL Editor do Supabase.";

/** Blocos do insert: lista grande em uma tacada só estoura o limite do PostgREST. */
const BLOCO = 500;

function tabelaAusente(codigo?: string, mensagem?: string): boolean {
  return (
    codigo === "42P01" ||
    codigo === "PGRST205" ||
    /Could not find the table/i.test(mensagem ?? "")
  );
}

/**
 * Importa a lista colada no painel. Contato repetido é ignorado pelo próprio
 * banco (o e-mail é único), então importar a mesma planilha duas vezes não
 * duplica ninguém nem apaga o que já estava lá.
 */
export async function importarMailing(
  texto: string,
  origem: string,
): Promise<ResultadoMailing> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  if (typeof texto !== "string" || !texto.trim()) {
    return { status: "erro", mensagem: "Cole a lista antes de importar." };
  }

  const leitura = analisarLista(texto);

  if (leitura.contatos.length === 0) {
    return {
      status: "erro",
      mensagem:
        "Nenhum e-mail encontrado no texto colado. Confira se cada linha traz um endereço.",
    };
  }

  const marca = String(origem ?? "").trim().slice(0, 120);

  const linhas = leitura.contatos.map((contato: ContatoImportado) => ({
    nome: contato.nome,
    email: contato.email,
    observacao: contato.observacao,
    origem: marca,
  }));

  let novos = 0;

  for (let inicio = 0; inicio < linhas.length; inicio += BLOCO) {
    const { data, error } = await supabase
      .from("mailing")
      .upsert(linhas.slice(inicio, inicio + BLOCO), {
        onConflict: "email",
        ignoreDuplicates: true,
      })
      .select("id");

    if (error) {
      console.error("Falha ao importar mailing:", error.message);
      if (tabelaAusente(error.code, error.message)) {
        return { status: "erro", mensagem: SEM_TABELA };
      }
      return {
        status: "erro",
        mensagem:
          novos > 0
            ? `A importação parou depois de ${novos} contatos. Tente de novo com o restante da lista.`
            : "Não foi possível importar a lista. Tente novamente.",
      };
    }

    novos += data?.length ?? 0;
  }

  const jaExistiam = linhas.length - novos;
  const partes = [
    `${novos} ${novos === 1 ? "contato novo" : "contatos novos"} na lista.`,
  ];
  if (jaExistiam > 0) partes.push(`${jaExistiam} já estavam cadastrados.`);
  if (leitura.repetidas > 0) {
    partes.push(`${leitura.repetidas} repetidos no texto colado.`);
  }
  if (leitura.ignoradas.length > 0) {
    partes.push(`${leitura.ignoradas.length} linhas sem e-mail foram puladas.`);
  }
  if (leitura.cortada) {
    partes.push(
      `A lista foi cortada em ${LIMITE_IMPORTACAO} por importação: cole o restante em uma segunda leva.`,
    );
  }

  revalidatePath("/admin/mailing");
  return { status: "ok", mensagem: partes.join(" ") };
}

const esquemaContatoMailing = z.object({
  nome: z.string().trim().max(120, "Nome muito longo.").optional().default(""),
  email: z
    .string()
    .trim()
    .min(1, "Informe o e-mail.")
    .email("E-mail inválido.")
    .max(150, "E-mail muito longo."),
  observacao: z.string().trim().max(200, "Observação muito longa.").optional().default(""),
  origem: z.string().trim().max(120).optional().default(""),
});

/** Inclui um contato pelo formulário de uma linha só. */
export async function adicionarContatoMailing(
  dados: unknown,
): Promise<ResultadoMailing> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const validacao = esquemaContatoMailing.safeParse(dados);
  if (!validacao.success) {
    return {
      status: "erro",
      mensagem: validacao.error.issues[0]?.message ?? "Dados inválidos.",
    };
  }

  const contato = validacao.data;

  const { error } = await supabase.from("mailing").insert({
    nome: contato.nome,
    email: contato.email.toLowerCase(),
    observacao: contato.observacao,
    origem: contato.origem,
  });

  if (error) {
    // 23505: o e-mail já está na lista.
    if (error.code === "23505") {
      return { status: "erro", mensagem: "Este e-mail já está na lista." };
    }
    if (tabelaAusente(error.code, error.message)) {
      return { status: "erro", mensagem: SEM_TABELA };
    }
    console.error("Falha ao incluir contato:", error.message);
    return { status: "erro", mensagem: "Não foi possível incluir o contato." };
  }

  revalidatePath("/admin/mailing");
  return { status: "ok", mensagem: "Contato incluído na lista." };
}

/** Liga e desliga o contato sem apagar o cadastro. */
export async function alternarContatoAtivo(
  id: string,
  ativo: boolean,
): Promise<ResultadoMailing> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { error } = await supabase.from("mailing").update({ ativo }).eq("id", id);

  if (error) {
    console.error("Falha ao alterar contato:", error.message);
    return {
      status: "erro",
      mensagem: "Não foi possível alterar a situação do contato.",
    };
  }

  revalidatePath("/admin/mailing");
  return {
    status: "ok",
    mensagem: ativo ? "Contato voltou para a lista." : "Contato fora dos envios.",
  };
}

export async function excluirContatoMailing(
  id: string,
): Promise<ResultadoMailing> {
  const supabase = await supabaseServidor();
  if (!supabase) return { status: "erro", mensagem: SEM_CONEXAO };

  const { error } = await supabase.from("mailing").delete().eq("id", id);

  if (error) {
    console.error("Falha ao excluir contato:", error.message);
    return { status: "erro", mensagem: "Não foi possível excluir o contato." };
  }

  revalidatePath("/admin/mailing");
  return { status: "ok", mensagem: "Contato excluído da lista." };
}
