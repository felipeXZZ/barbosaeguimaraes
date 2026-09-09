/**
 * Credenciais do Supabase. Ambas são públicas por natureza: a chave anônima
 * vai para o navegador e só consegue fazer o que as políticas de RLS
 * permitem (ver `supabase/schema.sql`).
 *
 * Sem as duas variáveis o site continua funcionando com os artigos do
 * arquivo `src/content/artigos.ts`, e o painel avisa que falta configurar.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/* O Supabase renomeou a chave pública: projetos novos recebem uma
   "publishable key" (sb_publishable_...) no lugar da antiga "anon key" (um
   JWT). As duas entram no mesmo lugar do createClient, então aceitamos
   qualquer um dos dois nomes de variável. */
export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "";

export const supabaseConfigurado = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

/** Bucket das fotos de capa, criado pelo `supabase/schema.sql`. */
export const BUCKET_CAPAS = "artigos";
