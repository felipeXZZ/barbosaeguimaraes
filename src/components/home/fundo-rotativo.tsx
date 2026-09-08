"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";
import type { SlideHero } from "@/types/content";

/** Tempo de cada foto no ar, já contando a transição. */
const PERMANENCIA_MS = 7000;

const posicao: Record<NonNullable<SlideHero["foco"]>, string> = {
  centro: "object-center",
  topo: "object-top",
  direita: "object-right",
  esquerda: "object-left",
};

/**
 * Rodízio das fotos do topo. Elas se sobrepõem e trocam por dissolução lenta,
 * sem deslizar: o nome do escritório fica parado por cima e um movimento
 * lateral atrás dele atrapalharia a leitura.
 *
 * O rodízio para quando a aba sai de foco, para não gastar bateria pintando o
 * que ninguém vê, e não existe sob prefers-reduced-motion: nesse caso fica a
 * primeira foto, sem troca.
 */
export function FundoRotativo({ slides }: { slides: SlideHero[] }) {
  const total = slides.length;
  const [atual, setAtual] = React.useState(0);
  const [abaOculta, setAbaOculta] = React.useState(false);
  const [menosMovimento, setMenosMovimento] = React.useState(false);

  React.useEffect(() => {
    const consulta = window.matchMedia("(prefers-reduced-motion: reduce)");
    const aplicar = () => setMenosMovimento(consulta.matches);
    aplicar();
    consulta.addEventListener("change", aplicar);
    return () => consulta.removeEventListener("change", aplicar);
  }, []);

  React.useEffect(() => {
    const aoTrocar = () => setAbaOculta(document.hidden);
    document.addEventListener("visibilitychange", aoTrocar);
    return () => document.removeEventListener("visibilitychange", aoTrocar);
  }, []);

  const parado = abaOculta || menosMovimento || total < 2;

  React.useEffect(() => {
    if (parado) return;
    const id = window.setInterval(
      () => setAtual((indice) => (indice + 1) % total),
      PERMANENCIA_MS,
    );
    return () => window.clearInterval(id);
  }, [parado, total]);

  return (
    <div aria-hidden className="absolute inset-0 -z-10 overflow-hidden">
      {slides.map((slide, indice) => {
        const visivel = indice === atual;
        return (
          <Image
            key={slide.src}
            src={slide.src}
            alt=""
            fill
            priority={indice === 0}
            sizes="100vw"
            className={cn(
              "object-cover saturate-[1.45] contrast-[1.12] transition-opacity duration-[1600ms] ease-in-out motion-reduce:transition-none",
              posicao[slide.foco ?? "centro"],
              /* A primeira foto ganha a aproximação lenta da abertura. */
              indice === 0 && "entra-fundo",
              visivel ? "opacity-100" : "opacity-0",
            )}
          />
        );
      })}
    </div>
  );
}
