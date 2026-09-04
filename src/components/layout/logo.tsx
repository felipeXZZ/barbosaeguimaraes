import { cn } from "@/lib/utils";

/**
 * Marca tipográfica do escritório. Enquanto não houver arquivo de logotipo
 * definitivo, a assinatura é construída em tipografia — nunca uma imagem
 * quebrada. Para substituir por um SVG, troque apenas o conteúdo abaixo.
 */
export function Logo({
  variante = "claro",
  className,
}: {
  /** "claro" = para fundo bordô. "escuro" = para fundo areia. */
  variante?: "claro" | "escuro";
  className?: string;
}) {
  const sobreEscuro = variante === "claro";

  return (
    <span className={cn("flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-serif text-[1.0625rem] font-semibold tracking-[-0.01em] sm:text-[1.1875rem]",
          sobreEscuro ? "text-areia-50" : "text-bordo-900",
        )}
      >
        Barbosa <span className="font-normal italic">e</span> Guimarães
      </span>
      <span
        aria-hidden
        className={cn(
          "mt-1.5 h-px w-8",
          sobreEscuro ? "bg-dourado-500" : "bg-dourado-700",
        )}
      />
      <span
        className={cn(
          "mt-1.5 text-[0.5625rem] font-medium tracking-[0.22em] uppercase sm:text-[0.625rem]",
          sobreEscuro ? "text-dourado-400" : "text-dourado-700",
        )}
      >
        Advogados Associados
      </span>
    </span>
  );
}
