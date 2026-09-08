"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

import { cn } from "@/lib/utils";

/** Mesma curva das entradas em CSS: o site inteiro se move com um gesto só. */
const SUAVE = [0.22, 1, 0.36, 1] as const;

export type DirecaoRevelar = "baixo" | "esquerda" | "direita" | "parado";

const deslocamento: Record<DirecaoRevelar, { x: number; y: number }> = {
  baixo: { x: 0, y: 24 },
  esquerda: { x: -28, y: 0 },
  direita: { x: 28, y: 0 },
  parado: { x: 0, y: 0 },
};

/*
 * A margem negativa embaixo segura a revelação até o bloco estar de fato
 * visível: com a margem folgada de antes, tudo abaixo da dobra já chegava
 * animado e o efeito não existia. A margem positiva no topo mantém a garantia
 * de que ninguém encontra um bloco em branco ao rolar de volta para cima.
 */
const AREA_DISPARO = "120px 0px -70px 0px";

function gesto(direcao: DirecaoRevelar): Variants {
  const { x, y } = deslocamento[direcao];
  return {
    oculto: { opacity: 0, x, y },
    visivel: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.6, ease: SUAVE },
    },
  };
}

/**
 * Revelação sutil ao entrar na viewport. Sob prefers-reduced-motion o
 * conteúdo simplesmente aparece, sem deslocamento nem atraso.
 */
export function Revelar({
  children,
  atraso = 0,
  direcao = "baixo",
  className,
}: {
  children: React.ReactNode;
  atraso?: number;
  direcao?: DirecaoRevelar;
  className?: string;
}) {
  const semMovimento = useReducedMotion();

  if (semMovimento) {
    return <div className={className}>{children}</div>;
  }

  const variantes = gesto(direcao);

  return (
    <motion.div
      data-revelar
      className={className}
      variants={variantes}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: AREA_DISPARO }}
      transition={{ delay: atraso }}
    >
      {children}
    </motion.div>
  );
}

/**
 * Contêiner de lista: os filhos entram em cascata, um logo atrás do outro,
 * em vez de cada card carregar seu próprio atraso na mão. Use com RevelarItem.
 */
export function RevelarGrupo({
  children,
  className,
  intervalo = 0.07,
  atraso = 0,
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  /** Segundos entre um filho e o seguinte. */
  intervalo?: number;
  atraso?: number;
  as?: "div" | "ul" | "ol";
}) {
  const semMovimento = useReducedMotion();
  const Comp =
    as === "ul" ? motion.ul : as === "ol" ? motion.ol : motion.div;
  const Simples = as;

  if (semMovimento) {
    return (
      <Simples className={className} role={as === "ul" ? "list" : undefined}>
        {children}
      </Simples>
    );
  }

  return (
    <Comp
      className={className}
      role={as === "ul" ? "list" : undefined}
      initial="oculto"
      whileInView="visivel"
      viewport={{ once: true, margin: AREA_DISPARO }}
      variants={{
        oculto: {},
        visivel: {
          transition: { delayChildren: atraso, staggerChildren: intervalo },
        },
      }}
    >
      {children}
    </Comp>
  );
}

/** Filho de RevelarGrupo. O momento de entrar vem do grupo, não daqui. */
export function RevelarItem({
  children,
  className,
  direcao = "baixo",
  as = "div",
}: {
  children: React.ReactNode;
  className?: string;
  direcao?: DirecaoRevelar;
  as?: "div" | "li";
}) {
  const Comp = as === "li" ? motion.li : motion.div;
  return (
    <Comp className={className} variants={gesto(direcao)}>
      {children}
    </Comp>
  );
}

/**
 * O filete dourado se desenha da esquerda para a direita quando o bloco entra
 * na tela. É o mesmo traço gráfico do site inteiro; aqui ele ganha o gesto de
 * quem risca a linha à mão, em vez de já estar pronto.
 */
export function FileteRevelado({ className }: { className?: string }) {
  const semMovimento = useReducedMotion();

  if (semMovimento) {
    return <span aria-hidden className={cn("filete", className)} />;
  }

  return (
    <motion.span
      aria-hidden
      className={cn("filete origin-left", className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, margin: AREA_DISPARO }}
      transition={{ duration: 0.7, delay: 0.1, ease: SUAVE }}
    />
  );
}
