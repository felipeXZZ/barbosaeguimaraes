"use client";

import { Mail, Phone } from "lucide-react";
import { usePathname } from "next/navigation";

import { IconeWhatsApp } from "@/components/layout/icone-whatsapp";
import { mensagemDaRota } from "@/content/mensagens-whatsapp";
import { site } from "@/content/site";
import { registrarEvento } from "@/lib/analytics";
import { linkEmail, linkTelefone, linkWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

type TipoContato = "whatsapp" | "telefone" | "email";

/**
 * Telefone, e-mail e WhatsApp sempre clicáveis, com registro do evento de
 * conversão. A mensagem do WhatsApp é contextual por rota.
 */
export function LinkContato({
  tipo,
  origem,
  className,
  rotulo,
  tema = "claro",
}: {
  tipo: TipoContato;
  /** Identifica o bloco de origem no dataLayer (header, rodape, hero...). */
  origem: string;
  className?: string;
  rotulo?: string;
  /** "claro" = texto claro sobre bordô. "escuro" = texto escuro sobre areia. */
  tema?: "claro" | "escuro";
}) {
  const pathname = usePathname();

  const configuracao = {
    whatsapp: {
      href: linkWhatsApp(mensagemDaRota(pathname)),
      texto: rotulo ?? "WhatsApp: " + site.contato.telefoneFormatado,
      evento: "clique_whatsapp" as const,
      externo: true,
      Icone: IconeWhatsApp,
    },
    telefone: {
      href: linkTelefone,
      texto: rotulo ?? site.contato.telefoneFormatado,
      evento: "clique_telefone" as const,
      externo: false,
      Icone: Phone,
    },
    email: {
      href: linkEmail,
      texto: rotulo ?? site.contato.email,
      evento: "clique_email" as const,
      externo: false,
      Icone: Mail,
    },
  }[tipo];

  const { Icone } = configuracao;

  return (
    <a
      href={configuracao.href}
      {...(configuracao.externo
        ? { target: "_blank", rel: "noopener noreferrer" }
        : {})}
      onClick={() => registrarEvento(configuracao.evento, { origem })}
      className={cn(
        "inline-flex items-center gap-3 text-[0.9375rem] transition-colors",
        tema === "claro"
          ? "text-areia-200 hover:text-dourado-400"
          : "text-grafite-900 hover:text-bordo-700",
        className,
      )}
    >
      <Icone
        aria-hidden
        className={cn(
          "size-4 shrink-0",
          tema === "claro" ? "text-dourado-500" : "text-dourado-700",
        )}
      />
      <span className="break-words">{configuracao.texto}</span>
    </a>
  );
}
