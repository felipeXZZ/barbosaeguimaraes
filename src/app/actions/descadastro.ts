"use server";

import { supabasePublico } from "@/lib/supabase/publico";

export type ResultadoSaida =
  | { status: "ok" }
  | { status: "nao-encontrado" }
  | { status: "erro" };

/**
 * Tira o contato da lista de divulgação pelo token do rodapé do e-mail.
 *
 * Roda com a chave pública, sem login: quem clica no link não tem conta no
 * painel. A permissão vem da função `descadastrar` do banco, que só enxerga
 * a linha do token exato (ver supabase/disparos.sql).
 */
export async function sairDaLista(token: string): Promise<ResultadoSaida> {
  const supabase = supabasePublico();
  if (!supabase) return { status: "erro" };

  const limpo = String(token ?? "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(limpo)) return { status: "nao-encontrado" };

  const { data, error } = await supabase.rpc("descadastrar", {
    p_token: limpo,
  });

  if (error) {
    console.error("Falha ao descadastrar:", error.message);
    return { status: "erro" };
  }

  return data === true ? { status: "ok" } : { status: "nao-encontrado" };
}
