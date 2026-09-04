import Image from "next/image";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/** Dimensões da arte já recortada em public/images/logo-*.png. */
const LARGURA = 633;
const ALTURA = 109;

/**
 * Assinatura do escritório. Duas versões da mesma arte: a clara é o arquivo
 * original (traço branco) e a escura é a mesma silhueta pintada em bordô,
 * gerada a partir do canal alfa — nunca aplicar filtro CSS para inverter.
 */
export function Logo({
  variante = "claro",
  className,
  prioridade = false,
  alt = site.nome,
}: {
  /** "claro" = para fundo bordô. "escuro" = para fundo areia. */
  variante?: "claro" | "escuro";
  className?: string;
  /** Marque na instância acima da dobra (o header) para evitar troca tardia. */
  prioridade?: boolean;
  /** Passe "" quando o link ao redor já tiver rótulo acessível. */
  alt?: string;
}) {
  return (
    <Image
      src={variante === "claro" ? "/images/logo-claro.png" : "/images/logo-escuro.png"}
      alt={alt}
      width={LARGURA}
      height={ALTURA}
      priority={prioridade}
      quality={90}
      sizes="232px"
      className={cn("h-8 w-auto sm:h-9 lg:h-10", className)}
    />
  );
}
