"use client";

import * as React from "react";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

import {
  alternarContatoAtivo,
  excluirContatoMailing,
} from "@/app/actions/mailing";
import type { ContatoMailing } from "@/lib/mailing";
import { cn } from "@/lib/utils";

/**
 * Uma pessoa da lista de divulgação. Desligar mantém o cadastro e tira dos
 * envios; excluir apaga de vez, que é o que a LGPD chama de eliminação e o
 * que se faz quando alguém pede para sair.
 */
export function LinhaMailing({ contato }: { contato: ContatoMailing }) {
  const router = useRouter();
  const [ativo, setAtivo] = React.useState(contato.ativo);
  const [ocupado, setOcupado] = React.useState(false);
  const [sumiu, setSumiu] = React.useState(false);
  const [erro, setErro] = React.useState("");

  React.useEffect(() => setAtivo(contato.ativo), [contato.ativo]);

  async function alternar() {
    const alvo = !ativo;
    setAtivo(alvo);
    setErro("");

    const resultado = await alternarContatoAtivo(contato.id, alvo);
    if (resultado.status === "erro") {
      setAtivo(!alvo);
      setErro(resultado.mensagem);
      return;
    }
    router.refresh();
  }

  async function excluir() {
    if (
      !window.confirm(
        `Excluir ${contato.email} da lista? Para apenas parar de enviar, use o interruptor.`,
      )
    ) {
      return;
    }

    setOcupado(true);
    setErro("");

    const resultado = await excluirContatoMailing(contato.id);
    setOcupado(false);

    if (resultado.status === "erro") {
      setErro(resultado.mensagem);
      return;
    }

    setSumiu(true);
    router.refresh();
  }

  if (sumiu) return null;

  /* Linha de apoio: só o que a planilha trouxe, na ordem em que ajuda a
     reconhecer a pessoa. */
  const local = [contato.cidade, contato.uf].filter(Boolean).join("/");
  const detalhes = [
    contato.telefone,
    contato.endereco,
    contato.bairro,
    local,
    contato.oab ? `OAB ${contato.oab}` : "",
    contato.subsecao,
    contato.observacao,
    contato.origem,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <li
      className={cn(
        "flex flex-wrap items-start gap-x-4 gap-y-3 border border-areia-200 bg-white p-3 sm:items-center sm:gap-x-5 sm:p-4",
        !ativo && "bg-areia-50/60",
      )}
    >
      <div className="min-w-0 flex-1 sm:min-w-[16rem]">
        <p
          className={cn(
            "font-serif text-[1.0625rem] text-bordo-900",
            !contato.nome && "text-grafite-600 italic",
          )}
        >
          {contato.nome || "sem nome"}
        </p>
        <p className="mt-0.5 break-all text-[0.875rem] text-grafite-900">
          <a
            href={`mailto:${contato.email}`}
            className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-dourado-700"
          >
            {contato.email}
          </a>
        </p>
        {detalhes ? (
          <p className="mt-1 line-clamp-2 text-[0.8125rem] text-grafite-600">
            {detalhes}
          </p>
        ) : null}
        {erro ? (
          <p role="alert" className="mt-1 text-[0.8125rem] text-erro">
            {erro}
          </p>
        ) : null}
      </div>

      <div className="flex w-full items-center justify-between gap-4 border-t border-areia-200 pt-3 sm:w-auto sm:justify-start sm:gap-5 sm:border-0 sm:pt-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            role="switch"
            aria-checked={ativo}
            aria-label={
              ativo
                ? `Tirar ${contato.email} dos envios`
                : `Voltar ${contato.email} para os envios`
            }
            onClick={alternar}
            className={cn(
              "relative inline-flex h-6 w-11 shrink-0 items-center rounded-[2px] border transition-colors duration-200",
              "outline-none focus-visible:ring-2 focus-visible:ring-dourado-700 focus-visible:ring-offset-2 focus-visible:ring-offset-areia-50",
              ativo
                ? "border-bordo-700 bg-bordo-700"
                : "border-grafite-400 bg-areia-200",
            )}
          >
            <span
              aria-hidden
              className={cn(
                "size-[1.125rem] rounded-[1px] bg-white transition-transform duration-200 motion-reduce:transition-none",
                ativo ? "translate-x-[1.4375rem]" : "translate-x-[0.1875rem]",
              )}
            />
          </button>
          <span
            className={cn(
              "w-[4.5rem] text-[0.8125rem] font-medium",
              ativo ? "text-bordo-700" : "text-grafite-600",
            )}
          >
            {ativo ? "Recebe" : "Fora"}
          </span>
        </div>

        <button
          type="button"
          onClick={excluir}
          disabled={ocupado}
          aria-label={`Excluir ${contato.email} da lista`}
          className="inline-flex h-10 items-center gap-1.5 rounded-[2px] border border-transparent px-3 text-[0.875rem] font-medium text-erro transition-colors hover:border-erro disabled:opacity-60"
        >
          {ocupado ? (
            <Loader2 aria-hidden className="size-3.5 animate-spin" />
          ) : (
            <Trash2 aria-hidden className="size-3.5" />
          )}
          <span className="sm:sr-only">Excluir</span>
        </button>
      </div>
    </li>
  );
}
