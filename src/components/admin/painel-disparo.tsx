"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  criarDisparo,
  enviarProximoBloco,
  enviarTeste,
  excluirDisparo,
  pararDisparo,
} from "@/app/actions/disparos";
import { Campo, Secao } from "@/components/admin/campo";
import { cn } from "@/lib/utils";

const CAMPO =
  "block w-full rounded-[2px] border border-grafite-400 bg-white px-3 text-[1rem] text-grafite-900 outline-none transition-colors placeholder:text-grafite-600/60 focus:border-bordo-700 focus:ring-2 focus:ring-bordo-700/15 sm:text-[0.9375rem]";
const CAMPO_LINHA = `${CAMPO} h-12`;

/* Uma pausa entre blocos. O Resend aceita duas requisições por segundo, e
   correr mais do que isso só rende erro de limite. */
const PAUSA = 700;

type Aviso = { tipo: "ok" | "erro"; texto: string } | null;

export interface ArtigoParaDisparo {
  id: string;
  titulo: string;
}

function numero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function esperar(ms: number): Promise<void> {
  return new Promise((resolver) => setTimeout(resolver, ms));
}

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

/**
 * Envio propriamente dito: manda um bloco de cada vez e mostra a barra andar.
 * Serve tanto para o disparo recém-criado quanto para retomar um que ficou
 * pela metade, porque o que manda é a fila de pendentes no banco.
 */
export function EnviarDisparo({
  id,
  assunto,
  total,
  enviados,
  pendentes,
  compacto = false,
}: {
  id: string;
  assunto: string;
  total: number;
  enviados: number;
  pendentes: number;
  /** Na listagem o botão é menor e sem a caixa de teste. */
  compacto?: boolean;
}) {
  const router = useRouter();
  const [feitos, setFeitos] = React.useState(enviados);
  const [restantes, setRestantes] = React.useState(pendentes);
  const [enviando, setEnviando] = React.useState(false);
  const [aviso, setAviso] = React.useState<Aviso>(null);
  const [testando, setTestando] = React.useState(false);

  const parar = React.useRef(false);

  async function disparar() {
    parar.current = false;
    setEnviando(true);
    setAviso(null);

    let saiu = feitos;
    let faltam = restantes;

    while (faltam > 0 && !parar.current) {
      const resultado = await enviarProximoBloco(id);

      if (resultado.status === "erro") {
        setEnviando(false);
        setAviso({ tipo: "erro", texto: resultado.mensagem });
        await pararDisparo(id);
        router.refresh();
        return;
      }

      saiu += resultado.enviados;
      faltam = resultado.pendentes;
      setFeitos(saiu);
      setRestantes(faltam);

      if (resultado.concluido) break;
      await esperar(PAUSA);
    }

    setEnviando(false);

    if (parar.current) {
      await pararDisparo(id);
      setAviso({
        tipo: "ok",
        texto: `Envio interrompido. ${numero(saiu)} já receberam; os outros continuam na fila e saem quando você retomar.`,
      });
    } else {
      setAviso({
        tipo: "ok",
        texto: `Disparo concluído. ${numero(saiu)} e-mails enviados.`,
      });
    }

    router.refresh();
  }

  async function testar() {
    setTestando(true);
    setAviso(null);
    const resultado = await enviarTeste(id);
    setTestando(false);
    setAviso({
      tipo: resultado.status === "ok" ? "ok" : "erro",
      texto: resultado.mensagem,
    });
  }

  const porcento = total > 0 ? Math.round((feitos / total) * 100) : 0;

  return (
    <div className="flex flex-col gap-3">
      {enviando || feitos > 0 ? (
        <div>
          <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={feitos}
            aria-label={`Progresso do disparo ${assunto}`}
            className="h-2 w-full overflow-hidden rounded-[2px] bg-areia-200"
          >
            <div
              className="h-full bg-bordo-700 transition-[width] duration-300"
              style={{ width: `${porcento}%` }}
            />
          </div>
          <p className="mt-2 text-[0.875rem] text-grafite-600">
            {numero(feitos)} de {numero(total)} enviados
            {enviando ? ". Deixe esta aba aberta até o fim." : "."}
          </p>
        </div>
      ) : null}

      <Recado aviso={aviso} />

      <div className="flex flex-wrap items-center gap-3">
        {enviando ? (
          <button
            type="button"
            onClick={() => {
              parar.current = true;
            }}
            className="inline-flex h-11 items-center gap-2 rounded-[2px] border border-areia-200 px-4 text-[0.875rem] font-medium text-grafite-900 transition-colors hover:border-erro hover:text-erro"
          >
            <Loader2 aria-hidden className="size-4 animate-spin" />
            Parar o envio
          </button>
        ) : restantes > 0 ? (
          <button
            type="button"
            onClick={disparar}
            className={cn(
              "inline-flex items-center justify-center gap-2 rounded-[2px] bg-bordo-700 font-medium text-white transition-colors hover:bg-bordo-600",
              compacto
                ? "h-10 px-4 text-[0.875rem]"
                : "h-12 w-full px-6 text-[0.9375rem] sm:w-auto",
            )}
          >
            <Send aria-hidden className="size-4" />
            {feitos > 0
              ? `Retomar (${numero(restantes)} restantes)`
              : `Enviar para ${numero(restantes)} contatos`}
          </button>
        ) : (
          <span className="inline-flex items-center gap-2 text-[0.875rem] font-medium text-bordo-700">
            <CheckCircle2 aria-hidden className="size-4" />
            Enviado para todos
          </span>
        )}

        {!compacto && !enviando ? (
          <button
            type="button"
            onClick={testar}
            disabled={testando}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-[2px] border border-areia-200 px-5 text-[0.9375rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700 disabled:opacity-60"
          >
            {testando ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : null}
            Enviar teste para o escritório
          </button>
        ) : null}
      </div>
    </div>
  );
}

/** Monta o disparo: escolhe a matéria, escreve o assunto e congela a lista. */
export function NovoDisparo({
  artigos,
  ativos,
}: {
  artigos: ArtigoParaDisparo[];
  /** Quantos contatos estão recebendo hoje. */
  ativos: number;
}) {
  const router = useRouter();
  const [artigoId, setArtigoId] = React.useState(artigos[0]?.id ?? "");
  const [assunto, setAssunto] = React.useState(artigos[0]?.titulo ?? "");
  const [abertura, setAbertura] = React.useState("");
  const [criando, setCriando] = React.useState(false);
  const [aviso, setAviso] = React.useState<Aviso>(null);
  const [criado, setCriado] = React.useState<{
    id: string;
    total: number;
  } | null>(null);

  function trocarArtigo(id: string) {
    const artigo = artigos.find((item) => item.id === id);
    setArtigoId(id);
    /* O assunto acompanha o título enquanto ninguém o escreveu à mão. */
    if (artigo && (assunto === "" || artigos.some((a) => a.titulo === assunto))) {
      setAssunto(artigo.titulo);
    }
  }

  async function criar() {
    setCriando(true);
    setAviso(null);

    const resultado = await criarDisparo({ artigoId, assunto, abertura });
    setCriando(false);

    if (resultado.status === "erro") {
      setAviso({ tipo: "erro", texto: resultado.mensagem });
      return;
    }

    setCriado({ id: resultado.id, total: resultado.total });
    setAviso({ tipo: "ok", texto: resultado.mensagem });
    router.refresh();
  }

  if (artigos.length === 0) {
    return (
      <Secao
        titulo="Novo disparo"
        descricao="Nenhuma matéria publicada para divulgar."
      >
        <p className="text-[0.9375rem] text-grafite-600">
          Publique um artigo em Artigos e volte aqui para enviá-lo à lista.
        </p>
      </Secao>
    );
  }

  if (criado) {
    return (
      <Secao
        titulo="Pronto para enviar"
        descricao={`${numero(criado.total)} contatos entraram nesta fila. Mande o teste antes, para conferir como o e-mail chega.`}
      >
        <EnviarDisparo
          id={criado.id}
          assunto={assunto}
          total={criado.total}
          enviados={0}
          pendentes={criado.total}
        />
      </Secao>
    );
  }

  return (
    <Secao
      titulo="Novo disparo"
      descricao={`A matéria vai para os ${numero(ativos)} contatos que estão recebendo hoje.`}
    >
      <Campo id="artigo" rotulo="Matéria" obrigatorio>
        <select
          id="artigo"
          value={artigoId}
          onChange={(evento) => trocarArtigo(evento.target.value)}
          className={CAMPO_LINHA}
        >
          {artigos.map((artigo) => (
            <option key={artigo.id} value={artigo.id}>
              {artigo.titulo}
            </option>
          ))}
        </select>
      </Campo>

      <Campo
        id="assunto"
        rotulo="Assunto do e-mail"
        obrigatorio
        dica="É a linha que a pessoa lê antes de abrir. Sem CAPS LOCK e sem ponto de exclamação: os dois derrubam a entrega."
      >
        <input
          id="assunto"
          value={assunto}
          onChange={(evento) => setAssunto(evento.target.value)}
          maxLength={160}
          className={CAMPO_LINHA}
        />
      </Campo>

      <Campo
        id="abertura"
        rotulo="Texto de abertura"
        dica="Opcional. Aparece antes do título da matéria, como uma nota do escritório."
      >
        <textarea
          id="abertura"
          rows={3}
          value={abertura}
          onChange={(evento) => setAbertura(evento.target.value)}
          maxLength={600}
          placeholder="Ex.: Compartilhamos abaixo a análise publicada esta semana."
          className={`${CAMPO} py-3`}
        />
      </Campo>

      <Recado aviso={aviso} />

      <div>
        <button
          type="button"
          onClick={criar}
          disabled={criando || !artigoId}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-bordo-700 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-bordo-600 disabled:opacity-60 sm:w-auto"
        >
          {criando ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden className="size-4" />
          )}
          Preparar o disparo
        </button>
        <p className="mt-2 text-[0.8125rem] text-grafite-600">
          Preparar não envia nada: só congela quem vai receber. O envio começa
          no botão seguinte.
        </p>
      </div>
    </Secao>
  );
}

/** Excluir um disparo já registrado. */
export function ExcluirDisparo({ id, assunto }: { id: string; assunto: string }) {
  const router = useRouter();
  const [ocupado, setOcupado] = React.useState(false);

  async function excluir() {
    if (
      !window.confirm(
        `Excluir o registro do disparo "${assunto}"? Os e-mails já enviados não voltam atrás; o que some é o histórico.`,
      )
    ) {
      return;
    }

    setOcupado(true);
    await excluirDisparo(id);
    setOcupado(false);
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={excluir}
      disabled={ocupado}
      aria-label={`Excluir o disparo ${assunto}`}
      className="inline-flex h-10 items-center gap-1.5 rounded-[2px] border border-transparent px-3 text-[0.875rem] font-medium text-erro transition-colors hover:border-erro disabled:opacity-60"
    >
      {ocupado ? (
        <Loader2 aria-hidden className="size-3.5 animate-spin" />
      ) : (
        <Trash2 aria-hidden className="size-3.5" />
      )}
      <span className="sr-only">Excluir</span>
    </button>
  );
}
