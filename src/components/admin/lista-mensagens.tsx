"use client";

import * as React from "react";
import {
  ChevronDown,
  Loader2,
  Mail,
  MailOpen,
  Phone,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { excluirMensagem, marcarMensagemLida } from "@/app/actions/mensagens";
import { cn } from "@/lib/utils";
import type { Mensagem } from "@/lib/mensagens";

function quando(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function CartaoMensagem({
  mensagem,
  area,
}: {
  mensagem: Mensagem;
  area: string;
}) {
  const router = useRouter();
  const [aberto, setAberto] = React.useState(false);
  const [lida, setLida] = React.useState(mensagem.lida);
  const [ocupado, setOcupado] = React.useState(false);
  const [erro, setErro] = React.useState("");
  const corpoId = React.useId();

  React.useEffect(() => setLida(mensagem.lida), [mensagem.lida]);

  async function alternarLeitura(alvo: boolean) {
    setLida(alvo);
    setErro("");
    const resultado = await marcarMensagemLida(mensagem.id, alvo);
    if (resultado.status === "erro") {
      setLida(!alvo);
      setErro(resultado.mensagem);
      return;
    }
    router.refresh();
  }

  /* Abrir a mensagem já conta como ler: é o que a pessoa espera de uma
     caixa de entrada, e evita um clique a mais no celular. */
  function abrir() {
    const proximo = !aberto;
    setAberto(proximo);
    if (proximo && !lida) void alternarLeitura(true);
  }

  async function excluir() {
    if (
      !window.confirm(
        `Excluir a mensagem de ${mensagem.nome}? O registro sai do painel para sempre.`,
      )
    ) {
      return;
    }

    setOcupado(true);
    setErro("");
    const resultado = await excluirMensagem(mensagem.id);
    setOcupado(false);

    if (resultado.status === "erro") {
      setErro(resultado.mensagem);
      return;
    }
    router.refresh();
  }

  return (
    <li
      className={cn(
        "border border-areia-200 bg-white transition-colors",
        !lida && "border-l-2 border-l-bordo-700",
      )}
    >
      <button
        type="button"
        onClick={abrir}
        aria-expanded={aberto}
        aria-controls={corpoId}
        className="flex w-full items-start gap-3 p-3 text-left sm:gap-4 sm:p-4"
      >
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[2px]",
            lida ? "bg-areia-100 text-grafite-600" : "bg-bordo-700 text-white",
          )}
        >
          {lida ? (
            <MailOpen className="size-4" />
          ) : (
            <Mail className="size-4" />
          )}
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-grafite-600">
            <span className="font-semibold tracking-[0.12em] text-dourado-700 uppercase">
              {area}
            </span>
            <span aria-hidden className="h-3 w-px bg-areia-200" />
            <time dateTime={mensagem.criadoEm}>{quando(mensagem.criadoEm)}</time>
            {!lida ? (
              <span className="rounded-[2px] bg-bordo-700/10 px-1.5 py-0.5 text-[0.6875rem] font-medium text-bordo-700">
                Nova
              </span>
            ) : null}
          </span>

          <span
            className={cn(
              "mt-1.5 block font-serif text-[1.0625rem] text-bordo-900",
              !lida && "font-semibold",
            )}
          >
            {mensagem.nome}
          </span>

          <span
            className={cn(
              "mt-1 block text-[0.875rem] text-grafite-600",
              !aberto && "line-clamp-1",
            )}
          >
            {mensagem.mensagem}
          </span>
        </span>

        <ChevronDown
          aria-hidden
          className={cn(
            "mt-1 size-4 shrink-0 text-grafite-600 transition-transform",
            aberto && "rotate-180",
          )}
        />
      </button>

      {aberto ? (
        <div
          id={corpoId}
          className="abre-painel border-t border-areia-200 p-3 sm:p-4"
        >
          <p className="text-[0.9375rem] leading-relaxed whitespace-pre-wrap text-grafite-900">
            {mensagem.mensagem}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.875rem]">
            <a
              href={`mailto:${mensagem.email}`}
              className="inline-flex items-center gap-1.5 text-bordo-700 underline decoration-dourado-700 underline-offset-4"
            >
              <Mail aria-hidden className="size-3.5" />
              {mensagem.email}
            </a>
            <a
              href={`tel:${mensagem.telefone.replace(/\D/g, "")}`}
              className="inline-flex items-center gap-1.5 text-bordo-700 underline decoration-dourado-700 underline-offset-4"
            >
              <Phone aria-hidden className="size-3.5" />
              {mensagem.telefone}
            </a>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-areia-200 pt-3">
            <button
              type="button"
              onClick={() => void alternarLeitura(!lida)}
              className="inline-flex h-10 items-center gap-1.5 rounded-[2px] border border-areia-200 px-3 text-[0.875rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700"
            >
              {lida ? "Marcar como não lida" : "Marcar como lida"}
            </button>

            <button
              type="button"
              onClick={excluir}
              disabled={ocupado}
              className="inline-flex h-10 items-center gap-1.5 rounded-[2px] border border-transparent px-3 text-[0.875rem] font-medium text-erro transition-colors hover:border-erro disabled:opacity-60"
            >
              {ocupado ? (
                <Loader2 aria-hidden className="size-3.5 animate-spin" />
              ) : (
                <Trash2 aria-hidden className="size-3.5" />
              )}
              Excluir
            </button>
          </div>

          {erro ? (
            <p role="alert" className="mt-2 text-[0.8125rem] text-erro">
              {erro}
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export function ListaMensagens({
  mensagens,
}: {
  mensagens: (Mensagem & { areaNome: string })[];
}) {
  return (
    <ul className="entra-lista mt-6 flex flex-col gap-3">
      {mensagens.map((mensagem) => (
        <CartaoMensagem
          key={mensagem.id}
          mensagem={mensagem}
          area={mensagem.areaNome}
        />
      ))}
    </ul>
  );
}
