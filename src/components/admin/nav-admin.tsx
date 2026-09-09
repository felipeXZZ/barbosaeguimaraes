"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

/*
 * "Disparos" está pronto e continua acessível por /admin/disparos, mas fora
 * do menu por enquanto: o domínio ainda não foi verificado no provedor de
 * e-mail, e um botão que leva a uma tela que não envia confunde quem usa.
 * Para trazer de volta, basta reativar a linha comentada abaixo.
 */
const ITENS = [
  { href: "/admin", rotulo: "Artigos" },
  { href: "/admin/mensagens", rotulo: "Mensagens" },
  { href: "/admin/mailing", rotulo: "Divulgação" },
  // { href: "/admin/disparos", rotulo: "Disparos" },
] as const;

/**
 * Menu do painel. Rola na horizontal no celular em vez de quebrar em duas
 * linhas, que é o que o cabeçalho tem de espaço.
 */
export function NavAdmin({ naoLidas }: { naoLidas: number }) {
  const caminho = usePathname();

  return (
    <nav
      aria-label="Seções do painel"
      className="-mx-1 flex items-center gap-1 overflow-x-auto"
    >
      {ITENS.map((item) => {
        const ativo =
          item.href === "/admin"
            ? caminho === "/admin" || caminho.startsWith("/admin/artigos")
            : caminho.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={ativo ? "page" : undefined}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-[2px] px-3 py-2 text-[0.875rem] font-medium whitespace-nowrap transition-colors",
              ativo
                ? "bg-areia-100 text-bordo-900"
                : "text-grafite-600 hover:text-bordo-700",
            )}
          >
            {item.rotulo}
            {item.href === "/admin/mensagens" && naoLidas > 0 ? (
              <span
                aria-label={`${naoLidas} não lidas`}
                className="inline-flex min-w-5 items-center justify-center rounded-[2px] bg-bordo-700 px-1.5 py-0.5 text-[0.6875rem] text-white"
              >
                {naoLidas}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
