"use client";

import { createBrowserClient } from "@supabase/ssr";

import {
  SUPABASE_ANON_KEY,
  SUPABASE_URL,
  supabaseConfigurado,
} from "@/lib/supabase/config";

/** Cliente do navegador, usado apenas na tela de login do painel. */
export function supabaseNavegador() {
  if (!supabaseConfigurado) return null;
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
