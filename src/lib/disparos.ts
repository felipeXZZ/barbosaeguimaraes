import "server-only";

import { tabelaNaoExiste } from "@/lib/supabase/erros";
import { supabaseServidor } from "@/lib/supabase/servidor";

export interface Disparo {
  id: string;
  assunto: string;
  abertura: string;
  artigoTitulo: string;
  artigoResumo: string;
  artigoUrl: string;
  artigoCapa: string;
  /** rascunho, enviando ou concluido. */
  situacao: string;
  criadoPor: string;
  /** ISO 8601 completo. */
  criadoEm: string;
  total: number;
  enviados: number;
  falhas: number;
  pendentes: number;
}

interface LinhaDisparo {
  id: string;
  assunto: string;
  abertura: string;
  artigo_titulo: string;
  artigo_resumo: string;
  artigo_url: string;
  artigo_capa: string;
  situacao: string;
  criado_por: string;
  criado_em: string;
  total: number;
  enviados: number;
  falhas: number;
  pendentes: number;
}

const COLUNAS =
  "id, assunto, abertura, artigo_titulo, artigo_resumo, artigo_url, artigo_capa, situacao, criado_por, criado_em, total, enviados, falhas, pendentes";

function paraDisparo(linha: LinhaDisparo): Disparo {
  return {
    id: linha.id,
    assunto: linha.assunto,
    abertura: linha.abertura,
    artigoTitulo: linha.artigo_titulo,
    artigoResumo: linha.artigo_resumo,
    artigoUrl: linha.artigo_url,
    artigoCapa: linha.artigo_capa,
    situacao: linha.situacao,
    criadoPor: linha.criado_por,
    criadoEm: linha.criado_em,
    total: Number(linha.total ?? 0),
    enviados: Number(linha.enviados ?? 0),
    falhas: Number(linha.falhas ?? 0),
    pendentes: Number(linha.pendentes ?? 0),
  };
}

/**
 * Disparos já criados, do mais recente para o mais antigo.
 * `null` significa que as tabelas ainda não existem no banco.
 */
export async function listarDisparos(): Promise<Disparo[] | null> {
  const supabase = await supabaseServidor();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("disparos_resumo")
    .select(COLUNAS)
    .order("criado_em", { ascending: false })
    .limit(50);

  if (error) {
    if (tabelaNaoExiste(error)) return null;
    console.error("Falha ao listar disparos:", error.message);
    return [];
  }

  return (data as LinhaDisparo[]).map(paraDisparo);
}

export async function buscarDisparo(id: string): Promise<Disparo | null> {
  const supabase = await supabaseServidor();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("disparos_resumo")
    .select(COLUNAS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Falha ao buscar disparo:", error.message);
    return null;
  }

  return data ? paraDisparo(data as LinhaDisparo) : null;
}
