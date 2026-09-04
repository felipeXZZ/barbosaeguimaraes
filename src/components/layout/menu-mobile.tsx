"use client";

import * as React from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Mail, Menu, Phone, X } from "lucide-react";
import Link from "next/link";

import { IconeWhatsApp } from "@/components/layout/icone-whatsapp";
import { Logo } from "@/components/layout/logo";
import { site } from "@/content/site";
import { navegacaoPrincipal } from "@/content/navegacao";
import { registrarEvento } from "@/lib/analytics";
import { linkEmail, linkTelefone, linkWhatsApp } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Menu mobile em drawer full-screen. O site antigo simplesmente não tinha um. */
export function MenuMobile({
  pathname,
  mensagemWhatsApp,
}: {
  pathname: string;
  mensagemWhatsApp: string;
}) {
  const [aberto, setAberto] = React.useState(false);

  // Fecha ao navegar para outra rota.
  React.useEffect(() => {
    setAberto(false);
  }, [pathname]);

  return (
    <Dialog.Root open={aberto} onOpenChange={setAberto}>
      <Dialog.Trigger
        className="inline-flex size-11 items-center justify-center text-areia-50 transition-colors hover:text-dourado-400 lg:hidden"
        aria-label="Abrir menu de navegação"
      >
        <Menu aria-hidden className="size-6" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-[60] bg-bordo-900/60 transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <Dialog.Popup
          className={cn(
            "sobre-bordo fixed inset-0 z-[70] flex h-dvh flex-col overflow-y-auto bg-bordo-900",
            "transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
          )}
        >
          <Dialog.Title className="sr-only">Menu de navegação</Dialog.Title>

          <div className="flex items-center justify-between px-5 py-4">
            <Logo />
            <Dialog.Close
              className="inline-flex size-11 items-center justify-center text-areia-50 transition-colors hover:text-dourado-400"
              aria-label="Fechar menu de navegação"
            >
              <X aria-hidden className="size-6" />
            </Dialog.Close>
          </div>

          <span aria-hidden className="mx-5 h-px bg-dourado-500/40" />

          <nav aria-label="Navegação principal" className="px-5 py-6">
            <ul className="flex flex-col">
              {navegacaoPrincipal.map((item) => {
                const ativo =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);
                return (
                  <li key={item.href} className="border-b border-areia-50/10">
                    <Link
                      href={item.href}
                      aria-current={ativo ? "page" : undefined}
                      className={cn(
                        "flex min-h-14 items-center font-serif text-[1.375rem] transition-colors",
                        ativo ? "text-dourado-400" : "text-areia-50",
                      )}
                    >
                      {item.rotulo}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="mt-auto flex flex-col gap-3 px-5 pb-8">
            <a
              href={linkWhatsApp(mensagemWhatsApp)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                registrarEvento("clique_whatsapp", { origem: "menu_mobile" })
              }
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-[2px] bg-areia-50 px-6 text-[0.9375rem] font-medium text-bordo-900 transition-colors hover:bg-white"
            >
              <IconeWhatsApp className="size-[1.125em]" />
              Falar com o escritório
            </a>

            <a
              href={linkTelefone}
              onClick={() =>
                registrarEvento("clique_telefone", { origem: "menu_mobile" })
              }
              className="inline-flex min-h-12 items-center gap-3 text-areia-50"
            >
              <Phone aria-hidden className="size-4 text-dourado-400" />
              {site.contato.telefoneFormatado}
            </a>

            <a
              href={linkEmail}
              onClick={() =>
                registrarEvento("clique_email", { origem: "menu_mobile" })
              }
              className="inline-flex min-h-12 items-center gap-3 break-all text-areia-50"
            >
              <Mail aria-hidden className="size-4 text-dourado-400" />
              {site.contato.email}
            </a>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
