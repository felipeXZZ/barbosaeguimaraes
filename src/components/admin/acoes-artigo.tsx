"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  alternarPublicacao,
  importarArtigosIniciais,
} from "@/app/actions/artigos";
import { cn } from "@/lib/utils";

/**
 * Interruptor de publicação. Vira na hora e só depois confirma com o
 * servidor: se a gravação falhar, volta sozinho e mostra o motivo.
 *
 * Cantos retos de 2px, como o resto do site. Um pill arredondado destoaria.
 */
export function InterruptorPublicacao({
  id,
  titulo,
  publicado,
}: {
  id: string;
  titulo: string;
  publicado: boolean;
}) {
  const router = useRouter();
  const [ligado, setLigado] = React.useState(publicado);
  const [ocupado, setOcupado] = React.useState(false);
  const [erro, setErro] = React.useState("");

  /* Depois de um refresh, quem manda é o valor que veio do banco. */
  React.useEffect(() => setLigado(publicado), [publicado]);

  async function alternar() {
    const alvo = !ligado;

    setLigado(alvo);
    setOcupado(true);
    setErro("");

    const resultado = await alternarPublicacao(id, alvo);
    setOcupado(false);

    if (resultado.status === "erro") {
      setLigado(!alvo);
      setErro(resultado.mensagem);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={ligado}
        aria-label={
          ligado
            ? `Tirar "${titulo}" do site`
            : `Publicar "${titulo}" no site`
        }
        onClick={alternar}
        disabled={ocupado}
        className={cn(
          "relative inline-flex h-6 w-11 shrink-0 items-center rounded-[2px] border transition-colors duration-200",
          "outline-none focus-visible:ring-2 focus-visible:ring-dourado-700 focus-visible:ring-offset-2 focus-visible:ring-offset-areia-50",
          "disabled:cursor-progress disabled:opacity-70",
          ligado
            ? "border-bordo-700 bg-bordo-700"
            : "border-grafite-400 bg-areia-200",
        )}
      >
        <span
          aria-hidden
          className={cn(
            "flex size-[1.125rem] items-center justify-center rounded-[1px] bg-white transition-transform duration-200 motion-reduce:transition-none",
            ligado ? "translate-x-[1.4375rem]" : "translate-x-[0.1875rem]",
          )}
        >
          {ocupado ? (
            <Loader2
              aria-hidden
              className="size-3 animate-spin text-grafite-600"
            />
          ) : null}
        </span>
      </button>

      <span
        className={cn(
          "w-[4.5rem] text-[0.8125rem] font-medium",
          ligado ? "text-bordo-700" : "text-grafite-600",
        )}
      >
        {ligado ? "No site" : "Rascunho"}
      </span>

      {erro ? (
        <span role="alert" className="text-[0.75rem] text-erro">
          {erro}
        </span>
      ) : null}
    </div>
  );
}

/** Carga inicial dos artigos que hoje vivem no repositório. */
export function BotaoImportar() {
  const router = useRouter();
  const [ocupado, setOcupado] = React.useState(false);
  const [erro, setErro] = React.useState("");

  async function importar() {
    setOcupado(true);
    setErro("");

    const resultado = await importarArtigosIniciais();
    setOcupado(false);

    if (resultado.status === "erro") {
      setErro(resultado.mensagem);
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={importar}
        disabled={ocupado}
        className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-bordo-700 px-5 text-[0.9375rem] font-medium text-bordo-700 transition-colors hover:bg-bordo-700 hover:text-white disabled:opacity-60"
      >
        {ocupado ? <Loader2 aria-hidden className="size-4 animate-spin" /> : null}
        Importar os 5 artigos atuais do site
      </button>
      {erro ? <p className="text-[0.8125rem] text-erro">{erro}</p> : null}
    </div>
  );
}
