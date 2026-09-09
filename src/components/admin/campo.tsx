"use client";

import * as React from "react";
import { AlertCircle, Info } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Ajuda de campo. Abre ao passar o cursor e fica presa ao clicar. Quem usa
 * mouse não precisa clicar, e quem usa teclado ou toque consegue abrir do
 * mesmo jeito. Esc fecha.
 */
export function Ajuda({
  rotulo,
  children,
}: {
  /** Nome do campo, lido por leitores de tela no botão. */
  rotulo: string;
  children: React.ReactNode;
}) {
  const [sobre, setSobre] = React.useState(false);
  const [preso, setPreso] = React.useState(false);
  const id = React.useId();
  const aberto = sobre || preso;

  React.useEffect(() => {
    if (!preso) return;

    function aoTeclar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setPreso(false);
    }

    document.addEventListener("keydown", aoTeclar);
    return () => document.removeEventListener("keydown", aoTeclar);
  }, [preso]);

  return (
    <span className="relative inline-flex">
      <button
        type="button"
        aria-label={`Ajuda sobre ${rotulo}`}
        aria-expanded={aberto}
        aria-describedby={aberto ? id : undefined}
        onClick={() => setPreso((atual) => !atual)}
        onMouseEnter={() => setSobre(true)}
        onMouseLeave={() => setSobre(false)}
        onFocus={() => setSobre(true)}
        onBlur={() => setSobre(false)}
        className={cn(
          "relative flex size-[1.125rem] items-center justify-center rounded-full border transition-colors",
          /* O ::after amplia o alvo de toque para ~42px sem ocupar espaco no
             layout: com 18px o dedo erra o "i" no celular. */
          "after:absolute after:-inset-3",
          "outline-none focus-visible:ring-2 focus-visible:ring-dourado-700 focus-visible:ring-offset-2",
          aberto
            ? "border-bordo-700 bg-bordo-700 text-white"
            : "border-grafite-400 text-grafite-600 hover:border-bordo-700 hover:text-bordo-700",
        )}
      >
        <Info aria-hidden className="size-3" />
      </button>

      {aberto ? (
        <span
          id={id}
          role="tooltip"
          className="absolute top-full left-0 z-20 mt-2 block w-[min(20rem,calc(100vw-3rem))] rounded-[2px] border border-areia-200 bg-white p-3 text-[0.8125rem] leading-relaxed text-grafite-600 shadow-[0_2px_12px_rgba(26,26,26,0.12)]"
        >
          {children}
        </span>
      ) : null}
    </span>
  );
}

export function ErroCampo({ mensagem }: { mensagem?: string }) {
  if (!mensagem) return null;
  return (
    <p className="mt-1.5 flex items-start gap-1.5 text-[0.8125rem] text-erro">
      <AlertCircle aria-hidden className="mt-px size-4 shrink-0" />
      {mensagem}
    </p>
  );
}

/**
 * Rótulo + ajuda + campo + erro, na mesma ordem em todo o formulário.
 * `dica` é retorno dinâmico (a URL que está sendo montada, um contador);
 * explicação de como preencher vai no `ajuda`, dentro do "i".
 */
export function Campo({
  id,
  rotulo,
  ajuda,
  dica,
  erro,
  obrigatorio = false,
  className,
  children,
}: {
  id: string;
  rotulo: string;
  ajuda?: React.ReactNode;
  dica?: React.ReactNode;
  erro?: string;
  obrigatorio?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <div className="flex items-center gap-2">
        <label
          htmlFor={id}
          className="text-[0.875rem] font-medium text-grafite-900"
        >
          {rotulo}
          {obrigatorio ? (
            <span aria-hidden className="ml-1 text-bordo-700">
              *
            </span>
          ) : null}
        </label>
        {ajuda ? <Ajuda rotulo={rotulo}>{ajuda}</Ajuda> : null}
      </div>

      <div className="mt-2">{children}</div>

      {dica ? (
        <p className="mt-1.5 text-[0.8125rem] text-grafite-600">{dica}</p>
      ) : null}

      <ErroCampo mensagem={erro} />
    </div>
  );
}

/** Bloco do formulário: título curto, uma linha de contexto e os campos. */
export function Secao({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border border-areia-200 bg-white">
      <header className="border-b border-areia-200 bg-areia-50/60 px-4 py-4 sm:px-6">
        <h2 className="font-serif text-[1.125rem] text-bordo-900">{titulo}</h2>
        <p className="mt-1 text-[0.8125rem] text-grafite-600">{descricao}</p>
      </header>
      <div className="flex flex-col gap-5 p-4 sm:gap-6 sm:p-6">{children}</div>
    </section>
  );
}
