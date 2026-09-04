import type { LucideIcon } from "lucide-react";

export type AreaSlug =
  | "direito-bancario-e-financeiro"
  | "direito-civel"
  | "direito-penal"
  | "direito-trabalhista"
  | "direito-empresarial"
  | "direito-ambiental"
  | "direito-desportivo"
  | "direito-autoral"
  | "direito-sindical"
  | "direito-tributario";

export interface Area {
  /** Slug em português sem acento, usado em /areas-de-atuacao/[slug] */
  slug: AreaSlug;
  /** Nome curto exibido em cards e navegação */
  nome: string;
  /** Título completo da página dedicada (H1) */
  titulo: string;
  /** Uma linha, usada em cards da home e no menu */
  resumoCurto: string;
  /** Meta description da página dedicada */
  metaDescricao: string;
  /** Dois parágrafos curtos, voz ativa */
  descricao: [string, string];
  /** O que o escritório faz na área — 4 a 6 subtemas */
  subtemas: string[];
  /** Situações concretas em que procurar o escritório */
  quandoProcurar: string[];
  /** Ícone lucide-react */
  icone: LucideIcon;
  /** Arquivo esperado em /public/images/areas/ */
  imagem: string;
  /** Alt text real e descritivo */
  imagemAlt: string;
  /** Área de destaque na home */
  destaque?: boolean;
}

export interface MembroEquipe {
  slug: string;
  nome: string;
  cargo: string;
  credenciais: string[];
  /** Biografia em parágrafos curtos. Opcional: nem todo membro tem bio longa. */
  bio?: string[];
  foto: string;
  fotoAlt: string;
  destaque?: boolean;
}

export interface Artigo {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 8601 — AAAA-MM-DD */
  date: string;
  readingTime: number;
  author: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  /** Corpo em Markdown simples; migra para MDX sem alteração de tipo. */
  content: string;
}
