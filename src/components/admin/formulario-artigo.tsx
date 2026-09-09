"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Eye,
  Heading2,
  ImagePlus,
  List,
  Loader2,
  Pencil,
  Trash2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { enviarCapa, excluirArtigo, salvarArtigo } from "@/app/actions/artigos";
import { Campo, ErroCampo, Secao } from "@/components/admin/campo";
import { MODELO_ARTIGO } from "@/content/modelo-artigo";
import { ConteudoMarkdown } from "@/components/shared/conteudo-markdown";
import {
  AUTOR_PADRAO,
  categoriasSugeridas,
  esquemaArtigo,
  estimarLeitura,
  gerarSlug,
  type DadosArtigo,
} from "@/lib/artigo-schema";
import { cn } from "@/lib/utils";
import type { ArtigoRegistro } from "@/types/content";

/* 16px no celular de proposito: com menos que isso o Safari do iPhone da
   zoom sozinho quando o campo recebe foco, e a pessoa tem que voltar com os
   dedos a cada toque. Do sm: para cima volta aos 15px do desenho. */
const CAMPO =
  "block w-full rounded-[2px] border border-grafite-400 bg-white px-3 text-[1rem] text-grafite-900 outline-none transition-colors placeholder:text-grafite-600/60 focus:border-bordo-700 focus:ring-2 focus:ring-bordo-700/15 sm:text-[0.9375rem]";
const CAMPO_LINHA = `${CAMPO} h-12`;

const LIMITE_RESUMO = 320;

function hoje(): string {
  const agora = new Date();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");
  return `${agora.getFullYear()}-${mes}-${dia}`;
}

export function FormularioArtigo({ artigo }: { artigo?: ArtigoRegistro }) {
  const router = useRouter();
  const editando = Boolean(artigo);

  const [aviso, setAviso] = React.useState<
    { tipo: "ok" | "erro"; texto: string } | null
  >(null);
  const [enviandoCapa, setEnviandoCapa] = React.useState(false);
  const [erroCapa, setErroCapa] = React.useState("");
  const [arrastando, setArrastando] = React.useState(false);
  const [excluindo, setExcluindo] = React.useState(false);
  const [prevendo, setPrevendo] = React.useState(false);

  /* Enquanto ninguém mexeu nos campos derivados, eles acompanham o título e
     o texto. Depois da primeira edição manual, param de se mover sozinhos. */
  const slugManual = React.useRef(editando);
  const leituraManual = React.useRef(editando);
  const areaTexto = React.useRef<HTMLTextAreaElement | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<DadosArtigo>({
    resolver: zodResolver(esquemaArtigo),
    defaultValues: artigo
      ? {
          id: artigo.id,
          title: artigo.title,
          slug: artigo.slug,
          excerpt: artigo.excerpt,
          date: artigo.date,
          readingTime: artigo.readingTime,
          author: artigo.author,
          category: artigo.category,
          coverImage: artigo.coverImage,
          coverImageAlt: artigo.coverImageAlt,
          content: artigo.content,
          published: artigo.published,
        }
      : {
          title: "",
          slug: "",
          excerpt: "",
          date: hoje(),
          readingTime: 1,
          author: AUTOR_PADRAO,
          category: "",
          coverImage: "",
          coverImageAlt: "",
          content: MODELO_ARTIGO,
          published: false,
        },
  });

  const capa = watch("coverImage");
  const slug = watch("slug");
  const conteudo = watch("content") ?? "";
  const resumo = watch("excerpt") ?? "";

  const { ref: refConteudo, ...campoConteudo } = register("content", {
    onChange: (evento) => {
      if (!leituraManual.current) {
        setValue("readingTime", estimarLeitura(evento.target.value));
      }
    },
  });

  /** Grava a situação escolhida antes de validar e envia. */
  function enviar(publicar: boolean) {
    /* Publicar o modelo sem ter escrito nada seria o acidente óbvio aqui. */
    if (publicar && (watch("content") ?? "").trim() === MODELO_ARTIGO.trim()) {
      setAviso({
        tipo: "erro",
        texto:
          "O corpo do artigo ainda é o modelo em branco. Escreva o texto antes de publicar, ou salve como rascunho por enquanto.",
      });
      return;
    }

    setValue("published", publicar);
    return handleSubmit((dados) => aoSalvar(dados, publicar))();
  }

  async function aoSalvar(dados: DadosArtigo, publicar: boolean) {
    setAviso(null);

    const resultado = await salvarArtigo({
      ...dados,
      id: artigo?.id,
      published: publicar,
    });

    if (resultado.status === "erro") {
      setAviso({ tipo: "erro", texto: resultado.mensagem });
      return;
    }

    setAviso({ tipo: "ok", texto: resultado.mensagem });

    if (!editando) {
      router.replace(`/admin/artigos/${resultado.id}`);
    }
    router.refresh();
  }

  async function subirArquivo(arquivo: File) {
    setErroCapa("");
    setEnviandoCapa(true);

    const formData = new FormData();
    formData.append("arquivo", arquivo);
    formData.append("slug", slug || gerarSlug(watch("title")) || "capa");

    const resultado = await enviarCapa(formData);
    setEnviandoCapa(false);

    if (resultado.status === "erro") {
      setErroCapa(resultado.mensagem);
      return;
    }

    setValue("coverImage", resultado.url, { shouldValidate: true });
  }

  async function aoEscolherCapa(evento: React.ChangeEvent<HTMLInputElement>) {
    const arquivo = evento.target.files?.[0];
    evento.target.value = "";
    if (arquivo) await subirArquivo(arquivo);
  }

  async function aoSoltar(evento: React.DragEvent<HTMLDivElement>) {
    evento.preventDefault();
    setArrastando(false);
    const arquivo = evento.dataTransfer.files?.[0];
    if (arquivo) await subirArquivo(arquivo);
  }

  async function aoExcluir() {
    if (!artigo) return;
    const confirmado = window.confirm(
      `Excluir "${artigo.title}"? Esta ação não pode ser desfeita.`,
    );
    if (!confirmado) return;

    setExcluindo(true);
    const resultado = await excluirArtigo(artigo.id);

    if (resultado.status === "erro") {
      setExcluindo(false);
      setAviso({ tipo: "erro", texto: resultado.mensagem });
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  /** Liga ou desliga um prefixo de Markdown na linha onde está o cursor. */
  function alternarPrefixo(prefixo: string) {
    const area = areaTexto.current;
    if (!area) return;

    const valor = area.value;
    const posicao = area.selectionStart;
    const inicioLinha = valor.lastIndexOf("\n", posicao - 1) + 1;
    const jaTem = valor.startsWith(prefixo, inicioLinha);

    const novo = jaTem
      ? valor.slice(0, inicioLinha) +
        valor.slice(inicioLinha + prefixo.length)
      : valor.slice(0, inicioLinha) + prefixo + valor.slice(inicioLinha);

    setValue("content", novo, { shouldValidate: true, shouldDirty: true });
    if (!leituraManual.current) {
      setValue("readingTime", estimarLeitura(novo));
    }

    const deslocamento = jaTem ? -prefixo.length : prefixo.length;
    requestAnimationFrame(() => {
      area.focus();
      const destino = Math.max(inicioLinha, posicao + deslocamento);
      area.setSelectionRange(destino, destino);
    });
  }

  return (
    <form
      onSubmit={(evento) => {
        evento.preventDefault();
        void enviar(Boolean(artigo?.published));
      }}
      noValidate
      className="flex flex-col gap-6 pb-4"
    >
      {aviso ? (
        <p
          role="status"
          className={cn(
            "flex items-start gap-2 rounded-[2px] border p-4 text-[0.9375rem]",
            aviso.tipo === "ok"
              ? "border-sucesso/40 bg-white text-grafite-900"
              : "border-erro/40 bg-white text-erro",
          )}
        >
          {aviso.tipo === "ok" ? (
            <CheckCircle2
              aria-hidden
              className="mt-px size-5 shrink-0 text-sucesso"
            />
          ) : (
            <AlertCircle aria-hidden className="mt-px size-5 shrink-0" />
          )}
          {aviso.texto}
        </p>
      ) : null}

      {/* ---------------------------------------------------- Identificação */}
      <Secao
        titulo="Identificação"
        descricao="Como o artigo é encontrado e catalogado no site."
      >
        <Campo
          id="title"
          rotulo="Título do artigo"
          obrigatorio
          erro={errors.title?.message}
          ajuda="É o que aparece grande no topo do artigo, no card da listagem e na aba do navegador. Frases diretas funcionam melhor que títulos criativos: quem procura no Google digita o assunto, não o trocadilho."
        >
          <input
            id="title"
            className={CAMPO_LINHA}
            placeholder="Os advogados e o Imposto de Renda"
            {...register("title", {
              onChange: (evento) => {
                if (!slugManual.current) {
                  setValue("slug", gerarSlug(evento.target.value));
                }
              },
            })}
          />
        </Campo>

        <Campo
          id="slug"
          rotulo="Endereço no site"
          obrigatorio
          erro={errors.slug?.message}
          dica={
            <>
              O artigo ficará em{" "}
              <code className="bg-areia-100 px-1 py-0.5 text-grafite-900">
                /artigos/{slug || "endereco-do-artigo"}
              </code>
            </>
          }
          ajuda="Preenchido sozinho a partir do título; só mexa se precisar. Depois que o artigo estiver publicado, mudar este campo troca o endereço da página: quem tiver salvado o link antigo vai cair em erro 404, e o Google leva tempo para reindexar."
        >
          <input
            id="slug"
            className={CAMPO_LINHA}
            placeholder="os-advogados-e-o-imposto-de-renda"
            {...register("slug", {
              onChange: () => {
                slugManual.current = true;
              },
            })}
          />
        </Campo>

        {/* No celular a categoria fica sozinha e data + tempo dividem a
            linha seguinte: sao campos curtos, um por linha so daria rolagem. */}
        <div className="grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-6">
          <Campo
            id="category"
            className="col-span-2 sm:col-span-1"
            rotulo="Categoria"
            obrigatorio
            erro={errors.category?.message}
            ajuda="Aparece em letras douradas acima do título, no card e na página do artigo. Clique no campo para ver as categorias já usadas. Repetir uma existente deixa o site mais coerente do que criar uma nova parecida."
          >
            <input
              id="category"
              list="categorias"
              className={CAMPO_LINHA}
              placeholder="Tributário"
              {...register("category")}
            />
            <datalist id="categorias">
              {categoriasSugeridas.map((categoria) => (
                <option key={categoria} value={categoria} />
              ))}
            </datalist>
          </Campo>

          <Campo
            id="date"
            rotulo="Data de publicação"
            obrigatorio
            erro={errors.date?.message}
            ajuda="É a data mostrada no artigo e a que ordena a listagem: o mais recente aparece primeiro. Pode ser retroativa, para textos antigos que estão sendo cadastrados agora."
          >
            <input
              id="date"
              type="date"
              className={CAMPO_LINHA}
              {...register("date")}
            />
          </Campo>

          <Campo
            id="readingTime"
            rotulo="Tempo de leitura"
            erro={errors.readingTime?.message}
            dica="Em minutos."
            ajuda="Calculado sozinho enquanto você escreve, na base de 200 palavras por minuto. Se você digitar um valor aqui, o cálculo automático para e passa a valer o seu número."
          >
            <input
              id="readingTime"
              type="number"
              min={1}
              max={90}
              className={CAMPO_LINHA}
              {...register("readingTime", {
                valueAsNumber: true,
                onChange: () => {
                  leituraManual.current = true;
                },
              })}
            />
          </Campo>
        </div>

        <Campo
          id="author"
          rotulo="Autor"
          obrigatorio
          erro={errors.author?.message}
          ajuda="Assinatura exibida no artigo. O padrão é o nome do escritório; troque pelo nome de um advogado quando o texto for assinado individualmente."
        >
          <input id="author" className={CAMPO_LINHA} {...register("author")} />
        </Campo>
      </Secao>

      {/* ------------------------------------------------------------- Capa */}
      <Secao
        titulo="Foto de capa"
        descricao="Imagem que abre o artigo e ilustra o card na listagem."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5">
          <div className="relative aspect-[16/9] w-full shrink-0 overflow-hidden rounded-[2px] border border-areia-200 bg-areia-100 sm:w-72">
            {capa ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={capa}
                alt="Pré-visualização da capa"
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-4 text-center text-[0.8125rem] text-grafite-600">
                <ImagePlus aria-hidden className="size-6 text-dourado-700" />
                Nenhuma foto escolhida
              </span>
            )}

            {enviandoCapa ? (
              <span className="absolute inset-0 flex items-center justify-center bg-white/80">
                <Loader2
                  aria-hidden
                  className="size-6 animate-spin text-bordo-700"
                />
              </span>
            ) : null}
          </div>

          <div className="flex-1">
            <div
              /* Arrastar arquivo nao existe no celular: la a area serve so de
                 moldura para o botao, com menos respiro. */
              onDragOver={(evento) => {
                evento.preventDefault();
                setArrastando(true);
              }}
              onDragLeave={() => setArrastando(false)}
              onDrop={aoSoltar}
              className={cn(
                "flex flex-col items-center gap-3 rounded-[2px] border border-dashed p-4 text-center transition-colors sm:p-6",
                arrastando
                  ? "border-bordo-700 bg-bordo-700/5"
                  : "border-grafite-400 bg-areia-50",
              )}
            >
              <Upload aria-hidden className="hidden size-5 text-grafite-600 sm:block" />
              <p className="hidden text-[0.875rem] text-grafite-600 sm:block">
                Arraste a foto até aqui
              </p>
              <label
                htmlFor="arquivo-capa"
                className="inline-flex h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-[2px] border border-bordo-700 px-5 text-[0.9375rem] font-medium text-bordo-700 transition-colors hover:bg-bordo-700 hover:text-white sm:h-11 sm:w-auto sm:text-[0.875rem]"
              >
                <ImagePlus aria-hidden className="size-4" />
                {capa ? "Trocar a foto" : "Escolher do computador"}
              </label>
              <input
                id="arquivo-capa"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={enviandoCapa}
                onChange={aoEscolherCapa}
              />
              <p className="text-[0.75rem] text-grafite-600">
                JPG, PNG ou WebP · até 8 MB · deitada (16:9) fica melhor
              </p>
            </div>

            <input type="hidden" {...register("coverImage")} />
            <ErroCampo mensagem={erroCapa || errors.coverImage?.message} />
          </div>
        </div>

        <Campo
          id="coverImageAlt"
          rotulo="Descrição da foto"
          obrigatorio
          erro={errors.coverImageAlt?.message}
          ajuda="Lida em voz alta por leitores de tela e exibida se a imagem não carregar. Descreva o que se vê na foto, sem repetir o título do artigo. Ex.: “Documentos de imposto de renda sobre mesa de trabalho”."
        >
          <input
            id="coverImageAlt"
            className={CAMPO_LINHA}
            placeholder="Documentos de declaração de imposto de renda sobre mesa de trabalho"
            {...register("coverImageAlt")}
          />
        </Campo>
      </Secao>

      {/* ----------------------------------------------------------- Texto */}
      <Secao
        titulo="Texto"
        descricao="O conteúdo do artigo e a chamada que convida à leitura."
      >
        <Campo
          id="excerpt"
          rotulo="Resumo"
          obrigatorio
          erro={errors.excerpt?.message}
          dica={
            <span
              className={cn(
                resumo.length > LIMITE_RESUMO && "font-medium text-erro",
              )}
            >
              {resumo.length} de {LIMITE_RESUMO} caracteres
            </span>
          }
          ajuda="Uma ou duas frases dizendo o que o artigo responde. Aparece em três lugares: no card da listagem, logo abaixo do título dentro do artigo e como descrição nos resultados do Google."
        >
          <textarea
            id="excerpt"
            rows={3}
            className={`${CAMPO} py-3 leading-relaxed`}
            placeholder="Uma ou duas frases sobre o que o artigo responde."
            {...register("excerpt")}
          />
        </Campo>

        <div>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <label
                htmlFor="content"
                className="text-[0.875rem] font-medium text-grafite-900"
              >
                Corpo do artigo
                <span aria-hidden className="ml-1 text-bordo-700">
                  *
                </span>
              </label>
            </div>

            <div className="flex items-center gap-1 rounded-[2px] border border-areia-200 bg-areia-50 p-1">
              <button
                type="button"
                onClick={() => setPrevendo(false)}
                aria-pressed={!prevendo}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                  !prevendo
                    ? "bg-white text-bordo-700 shadow-[0_1px_2px_rgba(26,26,26,0.08)]"
                    : "text-grafite-600 hover:text-bordo-700",
                )}
              >
                <Pencil aria-hidden className="size-3.5" />
                Escrever
              </button>
              <button
                type="button"
                onClick={() => setPrevendo(true)}
                aria-pressed={prevendo}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-[2px] px-3 py-1.5 text-[0.8125rem] font-medium transition-colors",
                  prevendo
                    ? "bg-white text-bordo-700 shadow-[0_1px_2px_rgba(26,26,26,0.08)]"
                    : "text-grafite-600 hover:text-bordo-700",
                )}
              >
                <Eye aria-hidden className="size-3.5" />
                Ver como fica
              </button>
            </div>
          </div>

          {prevendo ? (
            <div className="mt-3 min-h-[24rem] rounded-[2px] border border-areia-200 bg-areia-50 p-4 sm:p-6">
              {conteudo.trim() ? (
                <ConteudoMarkdown conteudo={conteudo} />
              ) : (
                <p className="text-grafite-600">Nada escrito ainda.</p>
              )}
            </div>
          ) : (
            <>
              <div className="mt-3 flex flex-wrap items-center gap-2 rounded-t-[2px] border border-b-0 border-grafite-400 bg-areia-50 px-3 py-2">
                <span className="hidden text-[0.75rem] font-medium tracking-[0.08em] text-grafite-600 uppercase sm:inline">
                  Formatar a linha
                </span>
                <button
                  type="button"
                  onClick={() => alternarPrefixo("## ")}
                  className="inline-flex items-center gap-1.5 rounded-[2px] border border-areia-200 bg-white px-2.5 py-1.5 text-[0.8125rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700"
                >
                  <Heading2 aria-hidden className="size-3.5" />
                  Subtítulo
                </button>
                <button
                  type="button"
                  onClick={() => alternarPrefixo("- ")}
                  className="inline-flex items-center gap-1.5 rounded-[2px] border border-areia-200 bg-white px-2.5 py-1.5 text-[0.8125rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700"
                >
                  <List aria-hidden className="size-3.5" />
                  Item de lista
                </button>
                {/* No celular a legenda sairia numa linha so para ela. O
                    paragrafo abaixo do campo ja explica o mesmo. */}
                <span className="hidden text-[0.75rem] text-grafite-600 sm:inline">
                  aplica onde o cursor estiver
                </span>
              </div>

              <textarea
                id="content"
                rows={20}
                className={cn(
                  CAMPO,
                  "rounded-t-none py-3 leading-[1.75] placeholder:text-grafite-600/50",
                )}
                {...campoConteudo}
                ref={(elemento) => {
                  refConteudo(elemento);
                  areaTexto.current = elemento;
                }}
              />

              <p className="mt-2 border-l-2 border-dourado-700 pl-3 text-[0.8125rem] text-grafite-600">
                Uma linha em branco separa parágrafos. Subtítulo começa com{" "}
                <code className="bg-areia-100 px-1">##</code> e item de lista
                com <code className="bg-areia-100 px-1">-</code>. Os botões
                acima fazem isso para você.
              </p>
            </>
          )}

          <ErroCampo mensagem={errors.content?.message} />
        </div>
      </Secao>

      {/* --------------------------------------------------------- Ações */}
      {/* No celular a barra tinha quatro filhos em flex-wrap: virava tres
          linhas de fundo translucido em cima do formulario. Agora sao duas
          faixas empilhadas e opacas. Do sm: para cima, `contents` desmancha
          os dois agrupadores e a barra volta a ser a linha unica do desenho. */}
      <div className="sticky bottom-0 z-10 -mx-4 flex flex-col gap-3 border-t border-areia-200 bg-areia-50 px-4 py-3 shadow-[0_-4px_16px_rgba(26,26,26,0.08)] sm:-mx-5 sm:flex-row sm:flex-wrap sm:items-center sm:bg-areia-50/95 sm:px-5 sm:py-4 sm:shadow-none sm:backdrop-blur lg:-mx-8 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:contents">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void enviar(false)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-bordo-700 px-4 text-[0.9375rem] font-medium whitespace-nowrap text-bordo-700 transition-colors hover:bg-bordo-700 hover:text-white disabled:opacity-60 sm:w-auto sm:px-5"
          >
            {isSubmitting ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : null}
            Salvar rascunho
          </button>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void enviar(true)}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-bordo-700 px-4 text-[0.9375rem] font-medium whitespace-nowrap text-white transition-colors hover:bg-bordo-600 disabled:opacity-60 sm:w-auto sm:px-6"
          >
            {isSubmitting ? (
              <Loader2 aria-hidden className="size-4 animate-spin" />
            ) : null}
            {/* Meia tela nao cabe "Salvar e manter no site" numa linha. */}
            <span className="sm:hidden">
              {artigo?.published ? "Salvar" : "Publicar"}
            </span>
            <span className="hidden sm:inline">
              {artigo?.published ? "Salvar e manter no site" : "Publicar no site"}
            </span>
          </button>
        </div>

        {artigo ? (
          <div className="flex items-center justify-between gap-4 border-t border-areia-200 pt-2 sm:contents sm:border-0 sm:pt-0">
            {artigo.published ? (
              <Link
                href={`/artigos/${artigo.slug}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4"
              >
                Ver no site
                <ExternalLink aria-hidden className="size-3.5" />
              </Link>
            ) : (
              /* Segura o "Excluir" na direita quando nao ha link de ver. */
              <span aria-hidden className="sm:hidden" />
            )}

            <button
              type="button"
              disabled={excluindo}
              onClick={aoExcluir}
              className="inline-flex h-10 items-center gap-2 text-[0.875rem] font-medium text-erro underline underline-offset-4 disabled:opacity-60 sm:ml-auto sm:h-12 sm:px-3"
            >
              <Trash2 aria-hidden className="size-4" />
              Excluir artigo
            </button>
          </div>
        ) : null}
      </div>
    </form>
  );
}
