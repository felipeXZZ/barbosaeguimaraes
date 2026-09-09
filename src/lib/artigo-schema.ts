import { z } from "zod";

/** Categorias sugeridas no painel. O campo aceita texto livre. */
export const categoriasSugeridas = [
  "Tributário",
  "Penal",
  "Cível",
  "Trabalhista",
  "Empresarial",
  "Constitucional",
  "Advocacia",
  "Carreira",
] as const;

export const AUTOR_PADRAO = "Barbosa e Guimarães Advogados Associados";

/**
 * Transforma um título em slug: sem acento, sem pontuação, com hífen.
 * Usada no painel e repetida no servidor: o slug vai para a URL pública,
 * então não pode depender do que o navegador enviou.
 */
export function gerarSlug(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

/** Estimativa de leitura a 200 palavras por minuto, mínimo de 1 minuto. */
export function estimarLeitura(conteudo: string): number {
  const palavras = conteudo.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(palavras / 200));
}

export const esquemaArtigo = z.object({
  id: z.string().uuid().optional(),
  title: z
    .string()
    .trim()
    .min(5, "O título precisa de pelo menos 5 caracteres.")
    .max(160, "Título muito longo."),
  slug: z
    .string()
    .trim()
    .min(3, "O endereço do artigo é obrigatório.")
    .max(90, "Endereço muito longo.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Use apenas letras minúsculas sem acento, números e hífen.",
    ),
  excerpt: z
    .string()
    .trim()
    .min(30, "O resumo precisa de pelo menos 30 caracteres.")
    .max(320, "Resumo muito longo. Limite de 320 caracteres."),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data de publicação."),
  readingTime: z.coerce
    .number()
    .int()
    .min(1, "Mínimo de 1 minuto.")
    .max(90, "Máximo de 90 minutos."),
  author: z.string().trim().min(3, "Informe o autor.").max(160),
  category: z.string().trim().min(3, "Informe a categoria.").max(60),
  coverImage: z
    .string()
    .trim()
    .min(1, "Envie a foto de capa do artigo.")
    .max(600),
  coverImageAlt: z
    .string()
    .trim()
    .min(10, "Descreva a foto para quem não pode vê-la.")
    .max(240, "Descrição muito longa."),
  content: z
    .string()
    .trim()
    .min(200, "O texto do artigo está muito curto."),
  /* Quem manda aqui é o botão que o editor apertou, não um campo da tela:
     o formulário carrega o valor atual e a ação de salvar o sobrescreve. */
  published: z.boolean(),
});

export type DadosArtigo = z.infer<typeof esquemaArtigo>;

export type ResultadoArtigo =
  | { status: "ok"; id: string; mensagem: string }
  | { status: "erro"; mensagem: string; campos?: Record<string, string> };
