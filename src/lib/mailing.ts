import "server-only";

import { tabelaNaoExiste } from "@/lib/supabase/erros";
import { supabaseServidor } from "@/lib/supabase/servidor";

export interface ContatoMailing {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  oab: string;
  subsecao: string;
  observacao: string;
  origem: string;
  ativo: boolean;
  /** ISO 8601 completo. */
  criadoEm: string;
}

interface LinhaMailing {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  endereco: string;
  bairro: string;
  cidade: string;
  uf: string;
  cep: string;
  oab: string;
  subsecao: string;
  observacao: string;
  origem: string;
  ativo: boolean;
  criado_em: string;
}

const COLUNAS =
  "id, nome, email, telefone, endereco, bairro, cidade, uf, cep, oab, subsecao, observacao, origem, ativo, criado_em";

/** Contatos por página na listagem do painel. */
export const POR_PAGINA = 100;

function paraContato(linha: LinhaMailing): ContatoMailing {
  return {
    id: linha.id,
    nome: linha.nome,
    email: linha.email,
    telefone: linha.telefone,
    endereco: linha.endereco,
    bairro: linha.bairro,
    cidade: linha.cidade,
    uf: linha.uf,
    cep: linha.cep,
    oab: linha.oab,
    subsecao: linha.subsecao,
    observacao: linha.observacao,
    origem: linha.origem,
    ativo: linha.ativo,
    criadoEm: linha.criado_em,
  };
}

export interface PaginaMailing {
  contatos: ContatoMailing[];
  /** Total que atende à busca atual. */
  total: number;
  /** Total de contatos na lista, sem busca. */
  totalGeral: number;
  ativos: number;
}

/**
 * Uma página da lista de divulgação. `null` significa que a tabela ainda não
 * existe no banco.
 */
export async function listarMailing(
  busca = "",
  pagina = 1,
): Promise<PaginaMailing | null> {
  const supabase = await supabaseServidor();
  if (!supabase) return { contatos: [], total: 0, totalGeral: 0, ativos: 0 };

  const de = (pagina - 1) * POR_PAGINA;

  let consulta = supabase
    .from("mailing")
    .select(COLUNAS, { count: "exact" })
    .order("criado_em", { ascending: false })
    .range(de, de + POR_PAGINA - 1);

  const termo = busca.trim();
  if (termo) {
    /* Vírgula separa as alternativas do `or` do PostgREST, e a busca é
       texto livre: sem esta limpeza um nome com vírgula quebraria a
       consulta inteira. */
    const limpo = termo.replace(/[,()%]/g, " ").trim();
    if (limpo) {
      consulta = consulta.or(
        `nome.ilike.%${limpo}%,email.ilike.%${limpo}%,cidade.ilike.%${limpo}%,oab.ilike.%${limpo}%,observacao.ilike.%${limpo}%,origem.ilike.%${limpo}%`,
      );
    }
  }

  const { data, error, count } = await consulta;

  if (error) {
    if (tabelaNaoExiste(error)) return null;
    console.error("Falha ao listar o mailing:", error.message);
    return { contatos: [], total: 0, totalGeral: 0, ativos: 0 };
  }

  const [{ count: totalGeral }, { count: ativos }] = await Promise.all([
    supabase.from("mailing").select("id", { count: "exact", head: true }),
    supabase
      .from("mailing")
      .select("id", { count: "exact", head: true })
      .eq("ativo", true),
  ]);

  return {
    contatos: (data as LinhaMailing[]).map(paraContato),
    total: count ?? 0,
    totalGeral: totalGeral ?? 0,
    ativos: ativos ?? 0,
  };
}

/**
 * Lista inteira, em blocos, para gerar o CSV de exportação. O PostgREST
 * devolve no máximo mil linhas por vez, então a paginação aqui é obrigatória.
 */
export async function listarMailingCompleto(): Promise<ContatoMailing[]> {
  const supabase = await supabaseServidor();
  if (!supabase) return [];

  const BLOCO = 1000;
  const todos: ContatoMailing[] = [];

  for (let inicio = 0; ; inicio += BLOCO) {
    const { data, error } = await supabase
      .from("mailing")
      .select(COLUNAS)
      .order("criado_em", { ascending: false })
      .range(inicio, inicio + BLOCO - 1);

    if (error) {
      console.error("Falha ao exportar o mailing:", error.message);
      break;
    }

    const linhas = data as LinhaMailing[];
    todos.push(...linhas.map(paraContato));

    if (linhas.length < BLOCO) break;
  }

  return todos;
}
