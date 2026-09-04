"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { IconeWhatsApp } from "@/components/layout/icone-whatsapp";
import { Logo } from "@/components/layout/logo";
import { MenuMobile } from "@/components/layout/menu-mobile";
import { Container } from "@/components/shared/container";
import { navegacaoPrincipal } from "@/content/navegacao";
import { mensagemDaRota } from "@/content/mensagens-whatsapp";
import { registrarEvento } from "@/lib/analytics";
import { linkWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** A partir daqui a barra recolhe ao descer e reaparece ao subir. */
const LIMITE_OCULTAR = 96;
/** Ignora microvariações de rolagem (trackpad, inércia) que fariam a barra piscar. */
const DELTA_MINIMO = 6;

export function Header() {
  const pathname = usePathname();
  const [rolou, setRolou] = React.useState(false);
  const [oculto, setOculto] = React.useState(false);
  const mensagem = mensagemDaRota(pathname);

  React.useEffect(() => {
    let ultimoY = window.scrollY;
    let agendado = false;

    const avaliar = () => {
      agendado = false;
      const y = Math.max(window.scrollY, 0);
      setRolou(y > 8);

      const delta = y - ultimoY;
      if (Math.abs(delta) < DELTA_MINIMO) return;
      setOculto(delta > 0 && y > LIMITE_OCULTAR);
      ultimoY = y;
    };

    const aoRolar = () => {
      if (agendado) return;
      agendado = true;
      window.requestAnimationFrame(avaliar);
    };

    avaliar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  return (
    <header
      className={cn(
        "sobre-bordo sticky top-0 z-50 transition-[background-color,box-shadow,transform] duration-300 motion-reduce:transition-none",
        oculto ? "-translate-y-full" : "translate-y-0",
        rolou
          ? "bg-bordo-900/90 shadow-[0_1px_0_0_var(--dourado-500)] backdrop-blur-md supports-[backdrop-filter]:bg-bordo-900/85"
          : "bg-bordo-900",
      )}
      /* Evita que o teclado leve o foco para uma barra fora da tela. */
      onFocus={() => setOculto(false)}
    >
      <Container>
        <div className="flex h-16 items-center justify-between gap-4 lg:h-20">
          <Link
            href="/"
            aria-label="Barbosa e Guimarães Advogados Associados — página inicial"
            className="shrink-0"
          >
            <Logo prioridade alt="" />
          </Link>

          <nav
            aria-label="Navegação principal"
            className="hidden flex-1 justify-center lg:flex"
          >
            <ul className="flex items-center gap-7">
              {navegacaoPrincipal.map((item) => {
                const ativo =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        "relative py-2 text-[0.9375rem] transition-colors",
                        "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-dourado-500 after:transition-transform after:duration-200",
                        ativo
                          ? "text-dourado-400 after:scale-x-100"
                          : "text-areia-50 after:scale-x-0 hover:text-dourado-400 hover:after:scale-x-100",
                      )}
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <a
              href={linkWhatsApp(mensagem)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                registrarEvento("clique_whatsapp", { origem: "header" })
              }
              className="hidden h-11 items-center justify-center gap-2 rounded-[2px] bg-areia-50 px-5 text-[0.9375rem] font-medium text-bordo-900 transition-colors hover:bg-white lg:inline-flex"
            >
              <IconeWhatsApp className="size-[1.0625em]" />
              Falar com o escritório
            </a>

            <MenuMobile pathname={pathname} mensagemWhatsApp={mensagem} />
          </div>
        </div>
      </Container>
    </header>
  );
}
