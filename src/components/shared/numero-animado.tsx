"use client";

import * as React from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Contagem crescente até o número final, disparada quando o dado entra na
 * tela. O HTML entregue pelo servidor já traz o valor certo: a contagem só
 * começa depois da montagem, então quem está sem JavaScript, sob
 * prefers-reduced-motion ou lendo por leitor de tela vê o número direto.
 */
export function NumeroAnimado({
  valor,
  className,
}: {
  valor: number;
  className?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const semMovimento = useReducedMotion();
  const naTela = useInView(ref, { once: true, margin: "0px 0px -60px 0px" });

  const [anima, setAnima] = React.useState(false);
  const [atual, setAtual] = React.useState(0);

  React.useEffect(() => {
    if (semMovimento) return;
    setAnima(true);
  }, [semMovimento]);

  React.useEffect(() => {
    if (!anima || !naTela) return;
    const controle = animate(0, valor, {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setAtual(Math.round(v)),
    });
    return () => controle.stop();
  }, [anima, naTela, valor]);

  return (
    <span ref={ref} className={className}>
      {anima ? atual : valor}
    </span>
  );
}
