"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Revelação sutil ao entrar na viewport. Sob prefers-reduced-motion o
 * conteúdo simplesmente aparece, sem deslocamento nem atraso.
 */
export function Revelar({
  children,
  atraso = 0,
  className,
}: {
  children: React.ReactNode;
  atraso?: number;
  className?: string;
}) {
  const semMovimento = useReducedMotion();

  if (semMovimento) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      data-revelar
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      /* margem positiva no topo: a revelação dispara ~240px ANTES de o
         elemento entrar na tela, então o usuário nunca encontra um bloco
         em branco ao rolar rápido. */
      viewport={{ once: true, margin: "240px 0px 240px 0px" }}
      transition={{ duration: 0.4, delay: atraso, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
