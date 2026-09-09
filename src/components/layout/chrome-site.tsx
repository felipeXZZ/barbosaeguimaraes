"use client";

import { usePathname } from "next/navigation";

/**
 * Esconde cabeçalho, rodapé e botão de WhatsApp dentro do painel.
 * O /admin tem um cabeçalho próprio e não é parte do site institucional.
 *
 * `usePathname` também roda na renderização do servidor, então o HTML já
 * sai sem essas peças, e não há troca depois que a página carrega.
 */
export function ChromeSite({ children }: { children: React.ReactNode }) {
  const caminho = usePathname();
  if (caminho?.startsWith("/admin")) return null;
  return <>{children}</>;
}
