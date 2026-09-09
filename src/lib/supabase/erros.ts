import type { PostgrestError } from "@supabase/supabase-js";

/* Códigos que o Postgres e o PostgREST usam quando a tabela pedida não
   existe. Acontece enquanto o SQL de `supabase/mensagens-e-mailing.sql`
   não tiver sido rodado, e o painel precisa explicar isso em vez de mostrar
   uma lista vazia como se nada houvesse. */
const AUSENTE = new Set(["42P01", "PGRST205", "PGRST106"]);

export function tabelaNaoExiste(erro: PostgrestError | null): boolean {
  if (!erro) return false;
  return (
    AUSENTE.has(erro.code ?? "") ||
    /Could not find the table/i.test(erro.message ?? "")
  );
}
