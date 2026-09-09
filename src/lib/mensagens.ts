import "server-only";

import { areas } from "@/content/areas";
import type { DadosContato } from "@/lib/schemas";
import { supabasePublico } from "@/lib/supabase/publico";
import { tabelaNaoExiste } from "@/lib/supabase/erros";
import { supabaseServidor } from "@/lib/supabase/servidor";

export interface Mensagem {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  /** Slug da área escolhida no formulário, ou "outra". */
  area: string;
  mensagem: string;
  lida: boolean;
  /** ISO 8601 completo. */
  criadoEm: string;
}

interface LinhaMensagem {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  area: string;
  mensagem: string;
  lida: boolean;
  criado_em: string;
}

const COLUNAS = "id, nome, email, telefone, area, mensagem, lida, criado_em";

/** Nome da área como aparece no site; "Outro assunto" para o resto. */
export function nomeDaArea(valor: string): string {
  return areas.find((area) => area.slug === valor)?.nome ?? "Outro assunto";
}

function paraMensagem(linha: LinhaMensagem): Mensagem {
  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    telefone: linha.telefone,
    area: linha.area,
    mensagem: linha.mensagem,
    lida: linha.lida,
    criadoEm: linha.criado_em,
  };
}

/**
 * Guarda no banco o que chegou pelo formulário. Roda com a chave pública,
 * que só tem permissão de inserir (ver `supabase/mensagens-e-mailing.sql`).
 *
 * Devolve se conseguiu gravar: o formulário usa isso para decidir se o
 * contato se perdeu ou se apenas o e-mail falhou.
 */
export async function registrarMensagem(dados: DadosContato): Promise<boolean> {
  const supabase = supabasePublico();
  if (!supabase) return false;

  const { error } = await supabase.from("mensagens").insert({
    nome: dados.nome,
    email: dados.email,
    telefone: dados.telefone,
    area: dados.area,
    mensagem: dados.mensagem,
    consentimento: true,
  });

  if (error) {
    console.error("Falha ao registrar mensagem:", error.message);
    return false;
  }

  return true;
}

/**
 * Mensagens recebidas, da mais recente para a mais antiga.
 * `null` significa que a tabela ainda não existe no banco.
 */
export async function listarMensagens(): Promise<Mensagem[] | null> {
  const supabase = await supabaseServidor();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("mensagens")
    .select(COLUNAS)
    .order("criado_em", { ascending: false })
    .limit(500);

  if (error) {
    if (tabelaNaoExiste(error)) return null;
    console.error("Falha ao listar mensagens:", error.message);
    return [];
  }

  return (data as LinhaMensagem[]).map(paraMensagem);
}

/** Quantas ainda não foram lidas, para o aviso no menu do painel. */
export async function contarMensagensNaoLidas(): Promise<number> {
  const supabase = await supabaseServidor();
  if (!supabase) return 0;

  const { count, error } = await supabase
    .from("mensagens")
    .select("id", { count: "exact", head: true })
    .eq("lida", false);

  if (error) return 0;
  return count ?? 0;
}
