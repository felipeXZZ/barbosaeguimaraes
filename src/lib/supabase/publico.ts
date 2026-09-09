import "server-only";

import { createClient } from "@supabase/supabase-js";

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabaseConfigurado,
} from "@/lib/supabase/config";

/**
 * Cliente de leitura do site público. Não usa cookies de sessão de
 * propósito: assim as páginas de artigos continuam podendo ser geradas
 * estaticamente e revalidadas, em vez de virarem dinâmicas.
 */
export function supabasePublico() {
  if (!supabaseConfigurado) return null;

  return createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
