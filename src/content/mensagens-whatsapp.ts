import type { AreaSlug } from "@/types/content";

/**
 * Mensagem pré-preenchida do WhatsApp por contexto.
 * Fica em módulo próprio (sem ícones nem textos longos) para que o botão
 * flutuante, que é client component, não arraste todo o conteúdo das áreas
 * para o bundle do navegador.
 */
export const MENSAGEM_PADRAO =
  "Olá, gostaria de falar com o escritório sobre uma questão jurídica.";

export const mensagensPorArea: Record<AreaSlug, string> = {
  "direito-bancario-e-financeiro":
    "Olá, gostaria de falar com o escritório sobre uma questão de direito bancário.",
  "direito-civel":
    "Olá, gostaria de falar com o escritório sobre uma questão cível.",
  "direito-penal":
    "Olá, gostaria de falar com o escritório sobre uma questão criminal.",
  "direito-trabalhista":
    "Olá, gostaria de falar com o escritório sobre uma questão trabalhista.",
  "direito-empresarial":
    "Olá, gostaria de falar com o escritório sobre uma questão empresarial.",
  "direito-ambiental":
    "Olá, gostaria de falar com o escritório sobre uma questão ambiental.",
  "direito-desportivo":
    "Olá, gostaria de falar com o escritório sobre uma questão de direito desportivo.",
  "direito-autoral":
    "Olá, gostaria de falar com o escritório sobre uma questão de direito autoral.",
  "direito-sindical":
    "Olá, gostaria de falar com o escritório sobre uma questão sindical.",
  "direito-tributario":
    "Olá, gostaria de falar com o escritório sobre uma questão tributária.",
};

/** Mensagens das rotas que não são páginas de área. */
const mensagensPorRota: Record<string, string> = {
  "/": MENSAGEM_PADRAO,
  "/sobre":
    "Olá, gostaria de conhecer melhor o trabalho do escritório e falar com um advogado.",
  "/equipe":
    "Olá, gostaria de falar com um dos advogados do escritório.",
  "/areas-de-atuacao":
    "Olá, gostaria de saber em qual área o escritório pode me atender.",
  "/artigos": MENSAGEM_PADRAO,
  "/contato": "Olá, gostaria de agendar um atendimento com o escritório.",
  "/politica-de-privacidade":
    "Olá, gostaria de falar sobre o tratamento dos meus dados pessoais.",
};

const PREFIXO_AREAS = "/areas-de-atuacao/";

/** Resolve a mensagem do WhatsApp a partir do caminho atual. */
export function mensagemDaRota(pathname: string): string {
  if (pathname.startsWith(PREFIXO_AREAS)) {
    const slug = pathname.slice(PREFIXO_AREAS.length) as AreaSlug;
    return mensagensPorArea[slug] ?? MENSAGEM_PADRAO;
  }
  if (pathname.startsWith("/artigos/")) {
    return "Olá, li um artigo no site e gostaria de falar com o escritório.";
  }
  return mensagensPorRota[pathname] ?? MENSAGEM_PADRAO;
}
