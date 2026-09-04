import { MENSAGEM_WHATSAPP_PADRAO, site } from "@/content/site";

/**
 * Monta o link do WhatsApp com mensagem pré-preenchida.
 * A mensagem é contextual por página. Ver `mensagemWhatsApp` em areas.ts.
 */
export function linkWhatsApp(mensagem: string = MENSAGEM_WHATSAPP_PADRAO): string {
  return `https://wa.me/${site.contato.telefoneDigitos}?text=${encodeURIComponent(mensagem)}`;
}

export const linkTelefone = `tel:${site.contato.telefoneE164}`;
export const linkEmail = `mailto:${site.contato.email}`;
