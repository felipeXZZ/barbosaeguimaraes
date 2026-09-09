import "server-only";

import { artigos as artigosIniciais } from "@/content/artigos";
import { supabasePublico } from "@/lib/supabase/publico";
import { supabaseServidor } from "@/lib/supabase/servidor";
import type { Artigo, ArtigoRegistro } from "@/types/content";

/** Colunas da tabela `public.artigos`, na forma em que o banco devolve. */
export interface LinhaArtigo {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  reading_time: number;
  author: string;
  category: string;
  cover_image: string;
  cover_image_alt: string;
  content: string;
  published: boolean;
  updated_at: string;
}

const COLUNAS =
  "id, slug, title, excerpt, date, reading_time, author, category, cover_image, cover_image_alt, content, published, updated_at";

function paraArtigo(linha: LinhaArtigo): ArtigoRegistro {
  return {
    id: linha.id,
    slug: linha.slug,
    title: linha.title,
    excerpt: linha.excerpt,
    /* `date` vem como AAAA-MM-DD; um timestamp completo quebraria o
       formatarData, então corta no dia. */
    date: linha.date.slice(0, 10),
    readingTime: linha.reading_time,
    author: linha.author,
    category: linha.category,
    coverImage: linha.cover_image,
    coverImageAlt: linha.cover_image_alt,
    content: linha.content,
    published: linha.published,
    updatedAt: linha.updated_at,
  };
}

/** Reserva usada enquanto o Supabase não estiver configurado. */
function reserva(): Artigo[] {
  return [...artigosIniciais].sort((a, b) => b.date.localeCompare(a.date));
}

/**
 * Artigos publicados, do mais recente para o mais antigo.
 * Se o banco estiver fora do ar, devolve o conteúdo do repositório em vez
 * de derrubar a página.
 */
export async function listarArtigos(): Promise<Artigo[]> {
  const supabase = supabasePublico();
  if (!supabase) return reserva();

  const { data, error } = await supabase
    .from("artigos")
    .select(COLUNAS)
    .eq("published", true)
    .order("date", { ascending: false });

  if (error) {
    console.error("Falha ao listar artigos:", error.message);
    return reserva();
  }

  return (data as LinhaArtigo[]).map(paraArtigo);
}

export async function buscarArtigo(slug: string): Promise<Artigo | null> {
  const supabase = supabasePublico();
  if (!supabase) {
    return reserva().find((artigo) => artigo.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("artigos")
    .select(COLUNAS)
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (error) {
    console.error("Falha ao buscar artigo:", error.message);
    return reserva().find((artigo) => artigo.slug === slug) ?? null;
  }

  return data ? paraArtigo(data as LinhaArtigo) : null;
}

export async function artigosRecentes(quantidade = 3): Promise<Artigo[]> {
  const todos = await listarArtigos();
  return todos.slice(0, quantidade);
}

/* -------------------------------------------------------------------------
   Painel: enxerga também os rascunhos, e só funciona autenticado.
   ------------------------------------------------------------------------- */

export async function listarArtigosDoPainel(): Promise<ArtigoRegistro[]> {
  const supabase = await supabaseServidor();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("artigos")
    .select(COLUNAS)
    .order("date", { ascending: false });

  if (error) {
    console.error("Falha ao listar artigos do painel:", error.message);
    return [];
  }

  return (data as LinhaArtigo[]).map(paraArtigo);
}

export async function buscarArtigoDoPainel(
  id: string,
): Promise<ArtigoRegistro | null> {
  const supabase = await supabaseServidor();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("artigos")
    .select(COLUNAS)
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Falha ao buscar artigo do painel:", error.message);
    return null;
  }

  return data ? paraArtigo(data as LinhaArtigo) : null;
}
