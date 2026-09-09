import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabaseConfigurado,
} from "@/lib/supabase/config";

/**
 * Cliente autenticado do painel, em Server Components e Server Actions.
 * A sessão vive em cookies httpOnly gravados pelo middleware.
 */
export async function supabaseServidor() {
  if (!supabaseConfigurado) return null;

  const armazenamento = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return armazenamento.getAll();
      },
      setAll(cookiesParaGravar) {
        try {
          for (const { name, value, options } of cookiesParaGravar) {
            armazenamento.set(name, value, options);
          }
        } catch {
          /* Server Component não pode gravar cookie: o middleware já cuida
             de renovar a sessão, então aqui o erro é esperado e ignorado. */
        }
      },
    },
  });
}

/**
 * Diz se a conta logada está na lista `public.editores`. Ter conta no
 * Supabase não basta para publicar: a checagem roda no banco, pela função
 * `eh_editor()`, que é a mesma usada pelas regras de RLS.
 */
export async function ehEditor(): Promise<boolean> {
  const supabase = await supabaseServidor();
  if (!supabase) return false;

  const { data, error } = await supabase.rpc("eh_editor");

  if (error) {
    console.error("Falha ao verificar permissão de editor:", error.message);
    return false;
  }

  return data === true;
}

/** Usuário autenticado no painel, ou null. */
export async function usuarioAtual() {
  const supabase = await supabaseServidor();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}
