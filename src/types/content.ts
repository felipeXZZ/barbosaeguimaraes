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
  /** O que o escritório faz na área: 4 a 6 subtemas */
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

export interface DestaqueCredencial {
  icone: LucideIcon;
  /** Rótulo curto: a instituição ou o título. */
  rotulo: string;
  /** Complemento opcional: cargo ou vínculo exercido ali. */
  detalhe?: string;
}

export interface MembroEquipe {
  slug: string;
  nome: string;
  cargo: string;
  credenciais: string[];
  /** Biografia em parágrafos curtos. Opcional: nem todo membro tem bio longa. */
  bio?: string[];
  /** Uma linha, para a chamada da home. Resume a bio sem substituí-la. */
  resumo?: string;
  /**
   * Recorte das credenciais para exibição em destaque, com ícone. Nada aqui
   * pode ir além do que já consta na lista de credenciais. O Provimento
   * 205/2021 admite qualificação verificável, não construção publicitária.
   */
  destaques?: DestaqueCredencial[];
  foto: string;
  fotoAlt: string;
  destaque?: boolean;
}

export interface Artigo {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO 8601, AAAA-MM-DD */
  date: string;
  readingTime: number;
  author: string;
  category: string;
  coverImage: string;
  coverImageAlt: string;
  /** Corpo em Markdown simples; migra para MDX sem alteração de tipo. */
  content: string;
}

export interface SlideHero {
  /** Arquivo em /public/images/hero/ */
  src: string;
  /** Alt real e descritivo. */
  alt: string;
  /**
   * "contain" para artes que já trazem fundo próprio, como o brasão;
   * "cover" para fotografia, que deve preencher o quadro.
   */
  ajuste: "contain" | "cover";
}
