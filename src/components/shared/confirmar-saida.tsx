"use client";

import * as React from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { sairDaLista } from "@/app/actions/descadastro";
import { Button } from "@/components/ui/button";

/**
 * Confirmação de saída da lista de divulgação.
 *
 * O clique é necessário de propósito: alguns servidores de e-mail abrem
 * sozinhos os links das mensagens para checar segurança, e sem a confirmação
 * eles descadastrariam a pessoa sem que ela tivesse pedido nada.
 */
export function ConfirmarSaida({ token }: { token: string }) {
  const [situacao, setSituacao] = React.useState<
    "parado" | "enviando" | "ok" | "nao-encontrado" | "erro"
  >("parado");

  async function confirmar() {
    setSituacao("enviando");
    const resultado = await sairDaLista(token);
    setSituacao(resultado.status);
  }

  if (situacao === "ok") {
    return (
      <p className="mt-8 flex items-start gap-3 border border-dourado-700/40 bg-areia-50 p-5 text-grafite-900">
        <CheckCircle2 aria-hidden className="mt-0.5 size-5 shrink-0 text-bordo-700" />
        <span>
          Pronto. Seu e-mail saiu da lista de divulgação e não receberá mais
          as matérias do escritório.
        </span>
      </p>
    );
  }

  if (situacao === "nao-encontrado") {
    return (
      <p className="mt-8 border border-areia-200 bg-white p-5 text-grafite-600">
        Este link não corresponde a nenhum cadastro. É possível que a saída já
        tenha sido feita antes. Se continuar recebendo, escreva para o
        escritório e resolvemos na mão.
      </p>
    );
  }

  return (
    <div className="mt-10 flex flex-col items-start gap-3">
      <Button
        type="button"
        variant="primario"
        onClick={confirmar}
        disabled={situacao === "enviando"}
      >
        {situacao === "enviando" ? (
          <Loader2 aria-hidden className="mr-2 size-4 animate-spin" />
        ) : null}
        Confirmar saída da lista
      </Button>

      {situacao === "erro" ? (
        <p role="alert" className="text-[0.9375rem] text-erro">
          Não foi possível concluir agora. Tente novamente em alguns instantes.
        </p>
      ) : null}
    </div>
  );
}
