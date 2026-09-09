"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Upload,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  adicionarContatoMailing,
  importarMailing,
} from "@/app/actions/mailing";
import { Campo, Secao } from "@/components/admin/campo";
import { analisarLista, LIMITE_IMPORTACAO } from "@/lib/mailing-importar";
import { cn } from "@/lib/utils";

/* 16px no celular de proposito: com menos que isso o Safari do iPhone da
   zoom sozinho quando o campo recebe foco. */
const CAMPO =
  "block w-full rounded-[2px] border border-grafite-400 bg-white px-3 text-[1rem] text-grafite-900 outline-none transition-colors placeholder:text-grafite-600/60 focus:border-bordo-700 focus:ring-2 focus:ring-bordo-700/15 sm:text-[0.9375rem]";
const CAMPO_LINHA = `${CAMPO} h-12`;

type Aviso = { tipo: "ok" | "erro"; texto: string } | null;

function Recado({ aviso }: { aviso: Aviso }) {
  if (!aviso) return null;
  return (
    <p
      role={aviso.tipo === "erro" ? "alert" : "status"}
      className={cn(
        "flex items-start gap-2 rounded-[2px] border p-3 text-[0.875rem]",
        aviso.tipo === "ok"
          ? "border-dourado-700/40 bg-areia-50 text-grafite-900"
          : "border-erro/40 bg-erro/5 text-erro",
      )}
    >
      {aviso.tipo === "ok" ? (
        <CheckCircle2 aria-hidden className="mt-px size-4 shrink-0" />
      ) : (
        <AlertCircle aria-hidden className="mt-px size-4 shrink-0" />
      )}
      {aviso.texto}
    </p>
  );
}

/** Colar a planilha inteira de uma vez. */
export function ImportarLista() {
  const router = useRouter();
  const [texto, setTexto] = React.useState("");
  const [origem, setOrigem] = React.useState("");
  const [ocupado, setOcupado] = React.useState(false);
  const [aviso, setAviso] = React.useState<Aviso>(null);

  /* A prévia acompanha a digitação sem travar a tela em lista grande. */
  const adiado = React.useDeferredValue(texto);
  const previa = React.useMemo(() => analisarLista(adiado), [adiado]);

  async function importar() {
    setOcupado(true);
    setAviso(null);

    const resultado = await importarMailing(texto, origem);
    setOcupado(false);

    setAviso({
      tipo: resultado.status === "ok" ? "ok" : "erro",
      texto: resultado.mensagem,
    });

    if (resultado.status === "ok") {
      setTexto("");
      router.refresh();
    }
  }

  const quantos = previa.contatos.length;

  const dica = [
    `${quantos} ${quantos === 1 ? "contato" : "contatos"} nesta colagem`,
    previa.repetidas > 0
      ? `${previa.repetidas} repetidos serão descartados`
      : "",
    previa.ignoradas.length > 0
      ? `${previa.ignoradas.length} linhas sem e-mail serão puladas`
      : "",
    previa.cortada
      ? `acima de ${LIMITE_IMPORTACAO} o restante fica para uma segunda leva`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Secao
      titulo="Importar lista"
      descricao="Cole os contatos, um por linha. Serve copiar e colar direto da planilha."
    >
      <Campo
        id="lista"
        rotulo="Nomes e e-mails"
        obrigatorio
        ajuda={
          <>
            Cada linha vira um contato. O e-mail pode vir sozinho ou junto do
            nome, em qualquer um destes formatos:
            <br />
            <br />
            <code>Ana Souza; ana@exemplo.com; OAB/SP 123456</code>
            <br />
            <code>Ana Souza, ana@exemplo.com</code>
            <br />
            <code>Ana Souza &lt;ana@exemplo.com&gt;</code>
            <br />
            <code>ana@exemplo.com</code>
            <br />
            <br />O que sobrar depois do nome vira observação. Linha sem e-mail
            é pulada, inclusive o cabeçalho da planilha.
          </>
        }
        dica={texto.trim() ? dica : "Uma linha por contato."}
      >
        <textarea
          id="lista"
          rows={8}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          spellCheck={false}
          placeholder={
            "Ana Souza; ana@exemplo.com; OAB/SP 123456\nBruno Lima; bruno@exemplo.com"
          }
          className={`${CAMPO} py-3 font-mono text-[0.875rem] leading-relaxed`}
        />
      </Campo>

      <Campo
        id="origem"
        rotulo="De onde veio esta lista"
        dica="Fica gravado em cada contato desta importação e ajuda a lembrar a procedência."
      >
        <input
          id="origem"
          value={origem}
          onChange={(evento) => setOrigem(evento.target.value)}
          maxLength={120}
          placeholder="Ex.: evento da OAB, indicações do escritório"
          className={CAMPO_LINHA}
        />
      </Campo>

      <Recado aviso={aviso} />

      <div>
        <button
          type="button"
          onClick={importar}
          disabled={ocupado || quantos === 0}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-bordo-700 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-bordo-600 disabled:opacity-60 sm:w-auto"
        >
          {ocupado ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Upload aria-hidden className="size-4" />
          )}
          {quantos > 0
            ? `Importar ${quantos} ${quantos === 1 ? "contato" : "contatos"}`
            : "Importar"}
        </button>
      </div>
    </Secao>
  );
}

/** Inclusão avulsa, para quando é um contato só. */
export function AdicionarContato() {
  const router = useRouter();
  const [nome, setNome] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [ocupado, setOcupado] = React.useState(false);
  const [aviso, setAviso] = React.useState<Aviso>(null);

  async function incluir(evento: React.FormEvent) {
    evento.preventDefault();
    setOcupado(true);
    setAviso(null);

    const resultado = await adicionarContatoMailing({ nome, email });
    setOcupado(false);

    setAviso({
      tipo: resultado.status === "ok" ? "ok" : "erro",
      texto: resultado.mensagem,
    });

    if (resultado.status === "ok") {
      setNome("");
      setEmail("");
      router.refresh();
    }
  }

  return (
    <Secao
      titulo="Incluir um contato"
      descricao="Para acrescentar uma pessoa sem mexer na lista inteira."
    >
      <form onSubmit={incluir} className="flex flex-col gap-5 sm:gap-6">
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-6">
          <Campo id="contato-nome" rotulo="Nome">
            <input
              id="contato-nome"
              value={nome}
              onChange={(evento) => setNome(evento.target.value)}
              maxLength={120}
              className={CAMPO_LINHA}
            />
          </Campo>

          <Campo id="contato-email" rotulo="E-mail" obrigatorio>
            <input
              id="contato-email"
              type="email"
              value={email}
              onChange={(evento) => setEmail(evento.target.value)}
              maxLength={150}
              required
              className={CAMPO_LINHA}
            />
          </Campo>
        </div>

        <Recado aviso={aviso} />

        <div>
          <button
            type="submit"
            disabled={ocupado}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-bordo-700 px-5 text-[0.9375rem] font-medium text-bordo-700 transition-colors hover:bg-bordo-700 hover:text-white disabled:opacity-60 sm:w-auto"
          >
            {ocupado ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <UserPlus aria-hidden className="size-4" />
            )}
            Incluir na lista
          </button>
        </div>
      </form>
    </Secao>
  );
}
