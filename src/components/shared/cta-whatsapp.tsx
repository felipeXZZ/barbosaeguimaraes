"use client";

import { usePathname } from "next/navigation";

import { IconeWhatsApp } from "@/components/layout/icone-whatsapp";
import { Button, type buttonVariants } from "@/components/ui/button";
import { mensagemDaRota } from "@/content/mensagens-whatsapp";
import { registrarEvento } from "@/lib/analytics";
import { linkWhatsApp } from "@/lib/whatsapp";
import type { VariantProps } from "class-variance-authority";

type VarianteBotao = VariantProps<typeof buttonVariants>;

/**
 * CTA de WhatsApp com mensagem contextual e registro do evento de conversão.
 * Client component enxuto para poder ser usado dentro de páginas server.
 */
export function CtaWhatsApp({
  origem,
  children = "Falar com o escritório",
  variant = "primario",
  size = "md",
  className,
  comIcone = true,
}: {
  origem: string;
  children?: React.ReactNode;
  variant?: VarianteBotao["variant"];
  size?: VarianteBotao["size"];
  className?: string;
  comIcone?: boolean;
}) {
  const pathname = usePathname();

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={linkWhatsApp(mensagemDaRota(pathname))}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => registrarEvento("clique_whatsapp", { origem })}
      >
        {comIcone ? <IconeWhatsApp className="size-[1.125em]" /> : null}
        {children}
      </a>
    </Button>
  );
}
