import * as React from "react";

import { cn } from "@/lib/utils";

type ContainerProps<T extends React.ElementType> = {
  as?: T;
  estreito?: boolean;
  className?: string;
  children: React.ReactNode;
};

/** Largura máxima e respiro lateral padrão do site. */
export function Container<T extends React.ElementType = "div">({
  as,
  estreito = false,
  className,
  children,
  ...props
}: ContainerProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof ContainerProps<T>>) {
  const Comp = (as ?? "div") as React.ElementType;
  return (
    <Comp
      className={cn(
        "mx-auto w-full px-5 sm:px-6 lg:px-8",
        estreito ? "max-w-[46rem]" : "max-w-[75rem]",
        className,
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
