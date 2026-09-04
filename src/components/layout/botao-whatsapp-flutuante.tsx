"use client";

import * as React from "react";
import { usePathname } from "next/navigation";

import { IconeWhatsApp } from "@/components/layout/icone-whatsapp";
import { mensagemDaRota } from "@/content/mensagens-whatsapp";
import { registrarEvento } from "@/lib/analytics";
import { linkWhatsApp } from "@/lib/whatsapp";

/**
 * Botão flutuante de WhatsApp, presente em todas as páginas.
 * A mensagem já vai pré-preenchida conforme a rota atual.
 * Sem pop-up, sem exit-intent, sem chat automatizado.
 */
export function BotaoWhatsAppFlutuante() {
  const pathname = usePathname();
  const mensagem = mensagemDaRota(pathname);

  return (
    <a
      href={linkWhatsApp(mensagem)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => registrarEvento("clique_whatsapp", { origem: "flutuante" })}
      aria-label="Falar com o escritório pelo WhatsApp"
      title="Falar com o escritório pelo WhatsApp"
      className="nao-imprimir fixed right-4 bottom-4 z-40 inline-flex size-14 items-center justify-center rounded-full bg-verde-whatsapp text-white shadow-[0_2px_10px_rgba(26,26,26,0.35)] transition-colors duration-200 hover:bg-verde-whatsapp-escuro focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-bordo-900 sm:right-6 sm:bottom-6"
    >
      <IconeWhatsApp className="size-7" />
    </a>
  );
}
