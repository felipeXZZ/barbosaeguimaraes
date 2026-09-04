import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Botão institucional. Cantos de no máximo 4px, sem sombra difusa,
 * sem gradiente. Todas as combinações de cor passam WCAG AA.
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-[2px] text-[0.9375rem] font-medium leading-none whitespace-nowrap transition-colors duration-200 outline-none disabled:pointer-events-none disabled:opacity-60 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-[1.125em]",
  {
    variants: {
      variant: {
        /* Bordô sólido sobre branco: 9.20:1 */
        primario:
          "bg-bordo-700 text-white hover:bg-bordo-600 active:bg-bordo-900",
        /* Contorno bordô sobre fundo claro: 8.68:1 */
        contorno:
          "border border-bordo-700 bg-transparent text-bordo-700 hover:bg-bordo-700 hover:text-white",
        /* Para uso sobre fundo bordô: areia sobre bordô 14.54:1 */
        claro:
          "bg-areia-50 text-bordo-900 hover:bg-white active:bg-areia-100",
        /* Contorno claro sobre fundo bordô */
        contornoClaro:
          "border border-areia-50/70 bg-transparent text-areia-50 hover:bg-areia-50 hover:text-bordo-900",
        /* Link textual */
        texto:
          "text-bordo-700 underline underline-offset-4 decoration-dourado-700 hover:decoration-bordo-700",
        fantasma: "text-grafite-900 hover:bg-areia-100",
      },
      size: {
        sm: "h-10 px-4",
        md: "h-12 px-5 sm:px-6",
        lg: "h-13 px-5 text-[0.9375rem] sm:h-14 sm:px-8 sm:text-base",
        icone: "size-11",
      },
    },
    defaultVariants: {
      variant: "primario",
      size: "md",
    },
  },
);

interface ButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant,
  size,
  asChild = false,
  type,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Button, buttonVariants };
