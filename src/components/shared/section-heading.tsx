import * as React from "react";

import { cn } from "@/lib/utils";

/** Filete dourado de 1px — elemento gráfico recorrente de separação. */
export function Filete({ className }: { className?: string }) {
  return <span aria-hidden className={cn("filete", className)} />;
}

interface SectionHeadingProps {
  /** Rótulo curto em caixa alta acima do título */
  sobrancelha?: string;
  titulo: React.ReactNode;
  descricao?: React.ReactNode;
  /** Nível do heading. A home usa h2; páginas internas variam. */
  nivel?: "h1" | "h2" | "h3";
  alinhamento?: "esquerda" | "centro";
  className?: string;
  id?: string;
}

const tamanhos: Record<"h1" | "h2" | "h3", string> = {
  h1: "text-[2rem] sm:text-[2.5rem] lg:text-[3.25rem]",
  h2: "text-[1.75rem] sm:text-[2.125rem] lg:text-[2.5rem]",
  h3: "text-[1.375rem] sm:text-[1.5rem]",
};

export function SectionHeading({
  sobrancelha,
  titulo,
  descricao,
  nivel = "h2",
  alinhamento = "esquerda",
  className,
  id,
}: SectionHeadingProps) {
  const Titulo = nivel;
  const centralizado = alinhamento === "centro";

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        centralizado && "items-center text-center",
        className,
      )}
    >
      {sobrancelha ? (
        <div
          className={cn(
            "flex items-center gap-3",
            centralizado && "justify-center",
          )}
        >
          <Filete className="w-8" />
          <span className="sobrancelha">{sobrancelha}</span>
        </div>
      ) : null}

      <Titulo id={id} className={cn("max-w-[26ch]", tamanhos[nivel])}>
        {titulo}
      </Titulo>

      {descricao ? (
        <p
          className={cn(
            "max-w-[62ch] text-grafite-600",
            centralizado && "mx-auto text-center",
          )}
        >
          {descricao}
        </p>
      ) : null}
    </div>
  );
}
