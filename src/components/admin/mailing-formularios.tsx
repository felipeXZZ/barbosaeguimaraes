"use client";

import * as React from "react";
import {
  AlertCircle,
  CheckCircle2,
  ClipboardList,
  FileSpreadsheet,
  Loader2,
  Plus,
  Upload,
  UserPlus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  adicionarContatoMailing,
  importarContatos,
  importarMailing,
  revalidarMailing,
} from "@/app/actions/mailing";
import { Campo, ErroCampo } from "@/components/admin/campo";
import {
  acharCabecalho,
  adivinharMapeamento,
  analisarLista,
  CAMPOS,
  LIMITE_IMPORTACAO,
  montarContatos,
  TAMANHO_DO_BLOCO,
  type Celula,
  type ContatoImportado,
  type Mapeamento,
} from "@/lib/mailing-importar";
import { cn } from "@/lib/utils";

/* 16px no celular de proposito: com menos que isso o Safari do iPhone da
   zoom sozinho quando o campo recebe foco. */
const CAMPO =
  "block w-full rounded-[2px] border border-grafite-400 bg-white px-3 text-[1rem] text-grafite-900 outline-none transition-colors placeholder:text-grafite-600/60 focus:border-bordo-700 focus:ring-2 focus:ring-bordo-700/15 sm:text-[0.9375rem]";
const CAMPO_LINHA = `${CAMPO} h-12`;

/** Teto do arquivo escolhido. Uma planilha de contatos não passa disso. */
const LIMITE_ARQUIVO = 25 * 1024 * 1024;

type Aviso = { tipo: "ok" | "erro"; texto: string } | null;

interface Aba {
  nome: string;
  linhas: Celula[][];
}

function numero(valor: number): string {
  return valor.toLocaleString("pt-BR");
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

/** Corpo de uma aba: só o espaçamento, sem cabeçalho nem borda própria. */
function Painel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-5 p-4 sm:gap-6 sm:p-6">{children}</div>
  );
}

function textoDaCelula(celula: Celula): string {
  if (celula == null) return "";
  if (celula instanceof Date) return celula.toLocaleDateString("pt-BR");
  return String(celula).trim();
}

/** Nome da coluna em planilha sem cabeçalho: A, B, C... */
function letraDaColuna(indice: number): string {
  let nome = "";
  let resto = indice;
  do {
    nome = String.fromCharCode(65 + (resto % 26)) + nome;
    resto = Math.floor(resto / 26) - 1;
  } while (resto >= 0);
  return nome;
}

/**
 * Lê o CSV respeitando o acento. O Excel em português salva CSV em
 * Windows-1252, não em UTF-8: sem essa segunda tentativa os nomes chegariam
 * com losango no lugar do "ç".
 */
async function csvEmTexto(arquivo: File): Promise<string> {
  const bytes = new Uint8Array(await arquivo.arrayBuffer());
  const utf8 = new TextDecoder("utf-8").decode(bytes);
  if (!utf8.includes("�")) return utf8;
  return new TextDecoder("windows-1252").decode(bytes);
}

/**
 * CSV em linhas e colunas. Respeita aspas (campo com ponto e vírgula dentro)
 * e aceita os três separadores que aparecem na prática.
 */
function csvEmLinhas(texto: string): Celula[][] {
  const primeira = texto.split(/\r?\n/, 1)[0] ?? "";
  const separador = [";", "\t", ","]
    .map((candidato) => ({
      candidato,
      quantas: primeira.split(candidato).length,
    }))
    .sort((a, b) => b.quantas - a.quantas)[0].candidato;

  const linhas: Celula[][] = [];
  let linha: string[] = [];
  let campo = "";
  let entreAspas = false;

  for (let i = 0; i < texto.length; i += 1) {
    const letra = texto[i];

    if (entreAspas) {
      if (letra === '"') {
        if (texto[i + 1] === '"') {
          campo += '"';
          i += 1;
        } else {
          entreAspas = false;
        }
      } else {
        campo += letra;
      }
      continue;
    }

    if (letra === '"') {
      entreAspas = true;
    } else if (letra === separador) {
      linha.push(campo);
      campo = "";
    } else if (letra === "\n") {
      linha.push(campo.replace(/\r$/, ""));
      linhas.push(linha);
      linha = [];
      campo = "";
    } else {
      campo += letra;
    }
  }

  if (campo || linha.length > 0) {
    linha.push(campo.replace(/\r$/, ""));
    linhas.push(linha);
  }

  return linhas;
}

/* -------------------------------------------------------------------------
   Planilha: escolher arquivo, dizer o que é cada coluna, gravar em blocos.
   ------------------------------------------------------------------------- */

function ImportarPlanilha({
  aoOcupar,
}: {
  /** Avisa a tela de fora enquanto a gravação está em andamento. */
  aoOcupar?: (ocupado: boolean) => void;
}) {
  const router = useRouter();

  const [nomeArquivo, setNomeArquivo] = React.useState("");
  const [abas, setAbas] = React.useState<Aba[] | null>(null);
  const [aba, setAba] = React.useState(0);
  const [linhaCabecalho, setLinhaCabecalho] = React.useState(-1);
  const [mapeamento, setMapeamento] = React.useState<Mapeamento>({});
  const [origem, setOrigem] = React.useState("");
  const [entraAtivo, setEntraAtivo] = React.useState(true);

  const [lendo, setLendo] = React.useState(false);
  const [arrastando, setArrastando] = React.useState(false);
  const [erroArquivo, setErroArquivo] = React.useState("");
  const [aviso, setAviso] = React.useState<Aviso>(null);
  const [progresso, setProgresso] = React.useState<{
    feitos: number;
    total: number;
    novos: number;
  } | null>(null);

  /* Ref, e não estado: o laço da importação precisa enxergar o valor novo
     sem esperar a próxima renderização. */
  const cancelado = React.useRef(false);

  const linhas = React.useMemo(() => abas?.[aba]?.linhas ?? [], [abas, aba]);

  /* Enquanto grava, ninguém pode fechar a tela por engano e matar o laço. */
  React.useEffect(() => {
    aoOcupar?.(progresso !== null);
  }, [progresso, aoOcupar]);

  const colunas = React.useMemo(() => {
    const quantas = linhas.reduce(
      (maior, linha) => Math.max(maior, linha.length),
      0,
    );
    const titulos =
      linhaCabecalho >= 0 ? (linhas[linhaCabecalho] ?? []).map(textoDaCelula) : [];

    return Array.from({ length: quantas }, (_, i) => ({
      indice: i,
      titulo: titulos[i] || `Coluna ${letraDaColuna(i)}`,
    }));
  }, [linhas, linhaCabecalho]);

  const leitura = React.useMemo(
    () =>
      montarContatos({
        linhas,
        mapeamento,
        inicio: linhaCabecalho + 1,
      }),
    [linhas, mapeamento, linhaCabecalho],
  );

  function prepararAba(todas: Aba[], indice: number) {
    const dados = todas[indice]?.linhas ?? [];
    const cabecalho = acharCabecalho(dados);
    setAba(indice);
    setLinhaCabecalho(cabecalho);
    setMapeamento(
      cabecalho >= 0
        ? adivinharMapeamento((dados[cabecalho] ?? []).map(textoDaCelula))
        : {},
    );
  }

  async function lerArquivo(arquivo: File) {
    const nome = arquivo.name.toLowerCase();
    setErroArquivo("");
    setAviso(null);
    setProgresso(null);

    if (nome.endsWith(".xls")) {
      setErroArquivo(
        "Este é o formato antigo do Excel. Abra a planilha, use Salvar como e escolha Pasta de Trabalho do Excel (.xlsx).",
      );
      return;
    }

    if (arquivo.size > LIMITE_ARQUIVO) {
      setErroArquivo("O arquivo tem mais de 25 MB. Divida a planilha em partes.");
      return;
    }

    setLendo(true);

    try {
      let lidas: Aba[];

      if (nome.endsWith(".xlsx")) {
        /* Carregado só na hora de usar: o leitor de xlsx não precisa entrar
           no pacote de quem abre o painel para escrever um artigo. */
        const { default: lerPlanilha } = await import(
          "read-excel-file/browser"
        );
        const planilha = await lerPlanilha(arquivo);
        lidas = planilha.map((pagina) => ({
          nome: pagina.sheet,
          linhas: pagina.data as Celula[][],
        }));
      } else {
        lidas = [
          { nome: arquivo.name, linhas: csvEmLinhas(await csvEmTexto(arquivo)) },
        ];
      }

      const comConteudo = lidas.filter((pagina) =>
        pagina.linhas.some((linha) => linha.some((celula) => textoDaCelula(celula))),
      );

      if (comConteudo.length === 0) {
        setErroArquivo("A planilha não tem nenhuma linha preenchida.");
        return;
      }

      setNomeArquivo(arquivo.name);
      setAbas(comConteudo);
      /* Começa pela aba mais cheia, que quase sempre é a lista de verdade. */
      const maior = comConteudo.reduce(
        (melhor, pagina, i) =>
          pagina.linhas.length > comConteudo[melhor].linhas.length ? i : melhor,
        0,
      );
      prepararAba(comConteudo, maior);
      if (!origem.trim()) setOrigem(arquivo.name.replace(/\.[^.]+$/, ""));
    } catch {
      setErroArquivo(
        "Não foi possível ler o arquivo. Confira se é mesmo .xlsx ou .csv e tente de novo.",
      );
    } finally {
      setLendo(false);
    }
  }

  function aoEscolher(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    /* Zera o input para que escolher o mesmo arquivo de novo dispare o
       onChange outra vez. */
    evento.target.value = "";
    if (arquivo) void lerArquivo(arquivo);
  }

  function aoSoltar(evento: React.DragEvent) {
    evento.preventDefault();
    setArrastando(false);
    const arquivo = evento.dataTransfer.files?.[0];
    if (arquivo) void lerArquivo(arquivo);
  }

  function alternarColuna(chave: keyof ContatoImportado, indice: number) {
    setMapeamento((atual) => {
      const campo = CAMPOS.find((item) => item.chave === chave);
      const escolhidas = atual[chave] ?? [];

      if (escolhidas.includes(indice)) {
        return { ...atual, [chave]: escolhidas.filter((i) => i !== indice) };
      }

      /* Campo de uma coluna só troca a escolha; os de várias acumulam, na
         ordem em que as colunas aparecem no arquivo. */
      const novas = campo?.varias ? [...escolhidas, indice].sort((a, b) => a - b) : [indice];
      return { ...atual, [chave]: novas };
    });
  }

  async function importar() {
    const contatos = leitura.contatos;
    if (contatos.length === 0) return;

    cancelado.current = false;
    setAviso(null);
    setProgresso({ feitos: 0, total: contatos.length, novos: 0 });

    let novos = 0;
    let feitos = 0;

    for (let i = 0; i < contatos.length; i += TAMANHO_DO_BLOCO) {
      if (cancelado.current) break;

      const bloco = contatos.slice(i, i + TAMANHO_DO_BLOCO);
      const resultado = await importarContatos(bloco, origem, entraAtivo);

      if (resultado.status === "erro") {
        setProgresso(null);
        setAviso({
          tipo: "erro",
          texto:
            feitos > 0
              ? `${resultado.mensagem} ${numero(novos)} contatos já haviam sido gravados; importe o arquivo de novo para continuar de onde parou.`
              : resultado.mensagem,
        });
        return;
      }

      novos += resultado.novos;
      feitos += bloco.length;
      setProgresso({ feitos, total: contatos.length, novos });
    }

    await revalidarMailing();
    setProgresso(null);

    const jaExistiam = feitos - novos;
    const partes = [
      cancelado.current ? "Importação interrompida." : "Importação concluída.",
      `${numero(novos)} ${novos === 1 ? "contato novo" : "contatos novos"}.`,
    ];
    if (jaExistiam > 0) partes.push(`${numero(jaExistiam)} já estavam na lista.`);
    if (leitura.repetidas > 0) {
      partes.push(`${numero(leitura.repetidas)} repetidos no arquivo.`);
    }
    if (leitura.ignoradas.length > 0) {
      partes.push("Linhas sem e-mail válido foram puladas.");
    }

    setAviso({ tipo: "ok", texto: partes.join(" ") });
    router.refresh();
  }

  const importando = progresso !== null;
  const semEmail = (mapeamento.email ?? []).length === 0;

  return (
    <Painel>
      <div>
        <span className="text-[0.875rem] font-medium text-grafite-900">
          Arquivo
        </span>

        <div
          onDragOver={(evento) => {
            evento.preventDefault();
            setArrastando(true);
          }}
          onDragLeave={() => setArrastando(false)}
          onDrop={aoSoltar}
          className={cn(
            "mt-2 flex flex-col items-center gap-3 rounded-[2px] border border-dashed p-4 text-center transition-colors sm:p-6",
            arrastando
              ? "border-bordo-700 bg-bordo-700/5"
              : "border-grafite-400 bg-areia-50",
          )}
        >
          <FileSpreadsheet
            aria-hidden
            className="hidden size-5 text-grafite-600 sm:block"
          />
          <p className="hidden text-[0.875rem] text-grafite-600 sm:block">
            {nomeArquivo || "Arraste a planilha até aqui"}
          </p>
          <label
            htmlFor="arquivo-lista"
            className={cn(
              "inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-bordo-700 px-5 text-[0.9375rem] font-medium text-bordo-700 transition-colors hover:bg-bordo-700 hover:text-white sm:h-11 sm:w-auto sm:text-[0.875rem]",
              lendo || importando ? "opacity-60" : "cursor-pointer",
            )}
          >
            {lendo ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : (
              <Upload aria-hidden className="size-4" />
            )}
            {lendo
              ? "Lendo a planilha…"
              : nomeArquivo
                ? "Trocar de arquivo"
                : "Escolher do computador"}
          </label>
          <input
            id="arquivo-lista"
            type="file"
            accept=".xlsx,.csv,.txt,text/csv,text/plain,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            className="sr-only"
            disabled={lendo || importando}
            onChange={aoEscolher}
          />
          <p className="text-[0.75rem] text-grafite-600">
            .xlsx ou .csv · até 25 MB · planilha grande demora alguns segundos
            para abrir
          </p>
        </div>

        <ErroCampo mensagem={erroArquivo} />
      </div>

      {abas && abas.length > 1 ? (
        <div className="abre-painel">
          <span className="text-[0.875rem] font-medium text-grafite-900">
            Aba da planilha
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {abas.map((pagina, i) => (
              <button
                key={pagina.nome + i}
                type="button"
                disabled={importando}
                onClick={() => prepararAba(abas, i)}
                className={cn(
                  "inline-flex h-10 items-center gap-2 rounded-[2px] border px-3 text-[0.875rem] font-medium transition-colors",
                  i === aba
                    ? "border-bordo-700 bg-bordo-700 text-white"
                    : "border-areia-200 text-grafite-900 hover:border-bordo-700 hover:text-bordo-700",
                )}
              >
                {pagina.nome}
                <span className="text-[0.75rem] opacity-80">
                  {numero(pagina.linhas.length)}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-1.5 text-[0.8125rem] text-grafite-600">
            Uma aba por vez. Para trazer as duas, importe uma e depois volte
            aqui e importe a outra.
          </p>
        </div>
      ) : null}

      {abas ? (
        <>
          <Campo
            id="cabecalho"
            rotulo="Linha com o nome das colunas"
            dica={
              linhaCabecalho >= 0
                ? "As linhas acima dela, e ela própria, ficam de fora da importação."
                : "Sem cabeçalho: todas as linhas entram como contato."
            }
          >
            <select
              id="cabecalho"
              value={linhaCabecalho}
              disabled={importando}
              onChange={(evento) => {
                const escolhida = Number(evento.target.value);
                setLinhaCabecalho(escolhida);
                setMapeamento(
                  escolhida >= 0
                    ? adivinharMapeamento(
                        (linhas[escolhida] ?? []).map(textoDaCelula),
                      )
                    : {},
                );
              }}
              className={CAMPO_LINHA}
            >
              <option value={-1}>A planilha não tem cabeçalho</option>
              {linhas.slice(0, 10).map((linha, i) => (
                <option key={i} value={i}>
                  Linha {i + 1}: {linha.map(textoDaCelula).filter(Boolean).join(", ").slice(0, 70)}
                </option>
              ))}
            </select>
          </Campo>

          <div>
            <span className="text-[0.875rem] font-medium text-grafite-900">
              O que é cada coluna
            </span>
            <p className="mt-1 text-[0.8125rem] text-grafite-600">
              O palpite abaixo veio dos nomes das colunas. Clique para tirar ou
              trocar. Endereço, telefone e observação aceitam mais de uma
              coluna, juntadas na ordem do arquivo. CPF fica de fora de
              propósito: o site não precisa dele para mandar artigo.
            </p>

            <div className="mt-3 flex flex-col gap-3">
              {CAMPOS.map((campo) => {
                const escolhidas = mapeamento[campo.chave] ?? [];
                return (
                  <div
                    key={campo.chave}
                    className="flex flex-col gap-2 border-b border-areia-200 pb-3 last:border-0 sm:flex-row sm:items-baseline sm:gap-4"
                  >
                    <span className="w-40 shrink-0 text-[0.875rem] font-medium text-grafite-900">
                      {campo.rotulo}
                      {campo.chave === "email" ? (
                        <span aria-hidden className="ml-1 text-bordo-700">
                          *
                        </span>
                      ) : null}
                    </span>

                    <div className="flex flex-wrap gap-1.5">
                      {colunas.map((coluna) => {
                        const marcada = escolhidas.includes(coluna.indice);
                        return (
                          <button
                            key={coluna.indice}
                            type="button"
                            disabled={importando}
                            aria-pressed={marcada}
                            onClick={() =>
                              alternarColuna(campo.chave, coluna.indice)
                            }
                            className={cn(
                              "inline-flex h-8 items-center rounded-[2px] border px-2 text-[0.8125rem] transition-colors",
                              marcada
                                ? "border-bordo-700 bg-bordo-700 text-white"
                                : "border-areia-200 text-grafite-600 hover:border-bordo-700 hover:text-bordo-700",
                            )}
                          >
                            {coluna.titulo.slice(0, 28)}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {leitura.contatos.length > 0 ? (
            <div className="abre-painel border border-areia-200 bg-areia-50 p-3 sm:p-4">
              <p className="text-[0.875rem] font-medium text-grafite-900">
                Como os dois primeiros vão ficar
              </p>
              <ul className="mt-2 flex flex-col gap-3">
                {leitura.contatos.slice(0, 2).map((contato) => (
                  <li
                    key={contato.email}
                    className="text-[0.8125rem] leading-relaxed text-grafite-600"
                  >
                    {CAMPOS.filter((campo) => contato[campo.chave]).map(
                      (campo) => (
                        <span key={campo.chave} className="mr-3 inline-block">
                          <span className="text-grafite-900/60">
                            {campo.rotulo}:
                          </span>{" "}
                          <strong className="font-medium text-grafite-900">
                            {contato[campo.chave]}
                          </strong>
                        </span>
                      ),
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <Campo
            id="origem-planilha"
            rotulo="De onde veio esta lista"
            dica="Fica gravado em cada contato desta importação e ajuda a lembrar a procedência."
          >
            <input
              id="origem-planilha"
              value={origem}
              disabled={importando}
              onChange={(evento) => setOrigem(evento.target.value)}
              maxLength={120}
              placeholder="Ex.: cadastro da OAB, FADESP Brasil ativos"
              className={CAMPO_LINHA}
            />
          </Campo>

          <label className="flex items-start gap-3 text-[0.875rem] text-grafite-900">
            <input
              type="checkbox"
              checked={!entraAtivo}
              disabled={importando}
              onChange={(evento) => setEntraAtivo(!evento.target.checked)}
              className="mt-0.5 size-4 accent-bordo-700"
            />
            <span>
              Entrar desligado, fora dos envios
              <span className="mt-0.5 block text-[0.8125rem] text-grafite-600">
                Para listas de gente que saiu, como a aba de excluídos: o
                cadastro fica guardado, mas não recebe.
              </span>
            </span>
          </label>

          <Recado aviso={aviso} />

          {progresso ? (
            <div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={progresso.total}
                aria-valuenow={progresso.feitos}
                aria-label="Progresso da importação"
                className="h-2 w-full overflow-hidden rounded-[2px] bg-areia-200"
              >
                <div
                  className="h-full bg-bordo-700 transition-[width] duration-200"
                  style={{
                    width: `${Math.round((progresso.feitos / progresso.total) * 100)}%`,
                  }}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-[0.875rem] text-grafite-600">
                  {numero(progresso.feitos)} de {numero(progresso.total)}{" "}
                  contatos · {numero(progresso.novos)} novos. Deixe esta aba
                  aberta até o fim.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    cancelado.current = true;
                  }}
                  className="inline-flex h-10 items-center rounded-[2px] border border-areia-200 px-4 text-[0.875rem] font-medium text-grafite-900 transition-colors hover:border-erro hover:text-erro"
                >
                  Parar
                </button>
              </div>
            </div>
          ) : (
            <div>
              <button
                type="button"
                onClick={importar}
                disabled={semEmail || leitura.contatos.length === 0}
                className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-bordo-700 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-bordo-600 disabled:opacity-60 sm:w-auto"
              >
                <Upload aria-hidden className="size-4" />
                {semEmail
                  ? "Escolha a coluna do e-mail"
                  : `Importar ${numero(leitura.contatos.length)} ${leitura.contatos.length === 1 ? "contato" : "contatos"}`}
              </button>

              {leitura.contatos.length > 0 ? (
                <p className="mt-2 text-[0.8125rem] text-grafite-600">
                  {numero(leitura.repetidas)} e-mails repetidos no arquivo serão
                  descartados. Quem já estiver na lista não é duplicado nem
                  sobrescrito.
                </p>
              ) : null}
            </div>
          )}
        </>
      ) : null}
    </Painel>
  );
}

/* -------------------------------------------------------------------------
   Texto colado: caminho curto, para meia dúzia de contatos.
   ------------------------------------------------------------------------- */

function ColarLista() {
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
    previa.repetidas > 0 ? `${previa.repetidas} repetidos serão descartados` : "",
    previa.ignoradas.length > 0
      ? `${previa.ignoradas.length} linhas sem e-mail serão puladas`
      : "",
    previa.cortada
      ? `acima de ${LIMITE_IMPORTACAO} use o caminho da planilha`
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Painel>
      <Campo
        id="lista"
        rotulo="Nomes e e-mails"
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
            é pulada.
          </>
        }
        dica={texto.trim() ? dica : "Uma linha por contato."}
      >
        <textarea
          id="lista"
          rows={5}
          value={texto}
          onChange={(evento) => setTexto(evento.target.value)}
          spellCheck={false}
          placeholder={
            "Ana Souza; ana@exemplo.com; OAB/SP 123456\nBruno Lima; bruno@exemplo.com"
          }
          className={`${CAMPO} py-3 font-mono text-[0.875rem] leading-relaxed`}
        />
      </Campo>

      <Campo id="origem" rotulo="De onde veio esta lista">
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
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-bordo-700 px-6 text-[0.9375rem] font-medium text-bordo-700 transition-colors hover:bg-bordo-700 hover:text-white disabled:opacity-60 sm:w-auto"
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
    </Painel>
  );
}

/* -------------------------------------------------------------------------
   Inclusão avulsa.
   ------------------------------------------------------------------------- */

function AdicionarContato() {
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
    <Painel>
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
    </Painel>
  );
}

/* -------------------------------------------------------------------------
   As três formas de incluir gente na lista, no mesmo lugar.
   ------------------------------------------------------------------------- */

const ABAS = [
  {
    chave: "planilha",
    rotulo: "Planilha",
    icone: FileSpreadsheet,
    descricao:
      "Escolha o arquivo do Excel, confira o que é cada coluna e grave a lista inteira.",
  },
  {
    chave: "colar",
    rotulo: "Colar lista",
    icone: ClipboardList,
    descricao: "Para poucos contatos, sem planilha: um por linha.",
  },
  {
    chave: "um",
    rotulo: "Um contato",
    icone: UserPlus,
    descricao: "Para acrescentar uma pessoa sem mexer na lista inteira.",
  },
] as const;

type ChaveAba = (typeof ABAS)[number]["chave"];

/**
 * Painel de inclusão. Fica fechado por padrão, porque no dia a dia quem abre
 * esta tela quer ver a lista, não importar de novo. Com a lista vazia começa
 * aberto, que aí a única coisa a fazer é justamente incluir alguém.
 *
 * As três abas ficam montadas o tempo todo, apenas escondidas: trocar de aba
 * no meio de uma importação não pode jogar fora a planilha já lida.
 */
export function AdicionarContatos({
  vazia,
  resumo,
  acoes,
  lista,
}: {
  vazia: boolean;
  /** Os números da lista inteira, escondidos enquanto a tela está aberta. */
  resumo?: React.ReactNode;
  /** Ações que acompanham o botão, como o link de baixar em CSV. */
  acoes?: React.ReactNode;
  /** A listagem de contatos, que dá lugar ao painel enquanto ele está aberto. */
  lista?: React.ReactNode;
}) {
  const [aberto, setAberto] = React.useState(vazia);
  const [aba, setAba] = React.useState<ChaveAba>("planilha");
  const [importando, setImportando] = React.useState(false);
  const atual = ABAS.find((item) => item.chave === aba) ?? ABAS[0];

  return (
    <>
      <div hidden={aberto}>{resumo}</div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setAberto((estava) => !estava)}
          disabled={importando}
          title={
            importando ? "Espere a importação terminar." : undefined
          }
          aria-expanded={aberto}
          aria-controls="painel-adicionar"
          className={cn(
            "inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] px-5 text-[0.9375rem] font-medium transition-colors disabled:opacity-60 sm:w-auto",
            aberto
              ? "border border-areia-200 bg-white text-grafite-900 hover:border-bordo-700 hover:text-bordo-700"
              : "bg-bordo-700 text-white hover:bg-bordo-600",
          )}
        >
          {aberto ? (
            <X aria-hidden className="size-4" />
          ) : (
            <Plus aria-hidden className="size-4" />
          )}
          {aberto ? "Voltar para a lista" : "Adicionar contatos"}
        </button>

        {/* Baixar a lista é assunto da listagem, não de quem está incluindo. */}
        {aberto ? null : acoes}
      </div>

      <div
        id="painel-adicionar"
        hidden={!aberto}
        className="abre-painel mt-4 border border-areia-200 bg-white"
      >
        <div
          role="tablist"
          aria-label="Como incluir contatos"
          className="flex items-center gap-1 overflow-x-auto border-b border-areia-200 bg-areia-50/60 px-2"
        >
          {ABAS.map((item) => {
            const selecionada = item.chave === aba;
            const Icone = item.icone;
            return (
              <button
                key={item.chave}
                type="button"
                role="tab"
                id={`aba-${item.chave}`}
                aria-selected={selecionada}
                aria-controls={`painel-${item.chave}`}
                onClick={() => setAba(item.chave)}
                className={cn(
                  "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[0.875rem] font-medium whitespace-nowrap transition-colors sm:px-4",
                  selecionada
                    ? "border-bordo-700 text-bordo-900"
                    : "border-transparent text-grafite-600 hover:text-bordo-700",
                )}
              >
                <Icone aria-hidden className="size-4" />
                {item.rotulo}
              </button>
            );
          })}
        </div>

        <p className="border-b border-areia-200 px-4 py-3 text-[0.8125rem] text-grafite-600 sm:px-6">
          {atual.descricao}
        </p>

        <div
          role="tabpanel"
          id="painel-planilha"
          aria-labelledby="aba-planilha"
          className={cn("abre-painel", aba !== "planilha" && "hidden")}
        >
          <ImportarPlanilha aoOcupar={setImportando} />
        </div>
        <div
          role="tabpanel"
          id="painel-colar"
          aria-labelledby="aba-colar"
          className={cn("abre-painel", aba !== "colar" && "hidden")}
        >
          <ColarLista />
        </div>
        <div
          role="tabpanel"
          id="painel-um"
          aria-labelledby="aba-um"
          className={cn("abre-painel", aba !== "um" && "hidden")}
        >
          <AdicionarContato />
        </div>
      </div>

      {/* A lista continua montada, só escondida: voltar da importação não
          recarrega nada nem perde a página em que a pessoa estava. */}
      <div hidden={aberto}>{lista}</div>
    </>
  );
}
