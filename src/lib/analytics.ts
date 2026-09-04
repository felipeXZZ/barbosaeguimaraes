/**
 * Eventos de conversão. O GTM é plugável via NEXT_PUBLIC_GTM_ID;
 * sem a variável definida, nada é carregado e nada é enviado.
 */

type EventoConversao =
  | "clique_whatsapp"
  | "clique_telefone"
  | "clique_email"
  | "envio_formulario"
  | "erro_formulario";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;
export const analyticsAtivo = Boolean(GTM_ID);

export function registrarEvento(
  evento: EventoConversao,
  detalhes: Record<string, string | number> = {},
): void {
  if (typeof window === "undefined" || !window.dataLayer) return;
  window.dataLayer.push({ event: evento, ...detalhes });
}
