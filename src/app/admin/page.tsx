import { Clock, ImageOff, Pencil, Plus } from "lucide-react";
import Link from "next/link";

import {
  BotaoImportar,
  InterruptorPublicacao,
} from "@/components/admin/acoes-artigo";
import { listarArtigosDoPainel } from "@/lib/artigos";
import { cn, formatarData } from "@/lib/utils";

/* A listagem depende da sessão em cookie: nunca pode ser servida de cache. */
export const dynamic = "force-dynamic";

const FILTROS = [
  { chave: "todos", rotulo: "Todos" },
  { chave: "publicados", rotulo: "No site" },
  { chave: "rascunhos", rotulo: "Rascunhos" },
] as const;

type ChaveFiltro = (typeof FILTROS)[number]["chave"];

interface Props {
  searchParams: Promise<{ filtro?: string }>;
}

export default async function PaginaAdmin({ searchParams }: Props) {
  const { filtro } = await searchParams;
  const ativo: ChaveFiltro = FILTROS.some((f) => f.chave === filtro)
    ? (filtro as ChaveFiltro)
    : "todos";

  const artigos = await listarArtigosDoPainel();
  const publicados = artigos.filter((artigo) => artigo.published).length;
  const rascunhos = artigos.length - publicados;

  const contagem: Record<ChaveFiltro, number> = {
    todos: artigos.length,
    publicados,
    rascunhos,
  };

  const visiveis = artigos.filter((artigo) =>
    ativo === "publicados"
      ? artigo.published
      : ativo === "rascunhos"
        ? !artigo.published
        : true,
  );

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-5 sm:gap-6">
        <div>
          <span className="sobrancelha block">Conteúdo do site</span>
          <h1 className="mt-3 font-serif text-[1.875rem] text-bordo-900">
            Artigos
          </h1>
          <p className="mt-2 text-[0.9375rem] text-grafite-600">
            {artigos.length === 0
              ? "Nenhum artigo cadastrado ainda."
              : `${publicados} no site · ${rascunhos} ${rascunhos === 1 ? "rascunho" : "rascunhos"}. Use o interruptor para tirar ou colocar um artigo no ar.`}
          </p>
        </div>

        <Link
          href="/admin/artigos/novo"
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] bg-bordo-700 px-6 text-[0.9375rem] font-medium text-white transition-colors hover:bg-bordo-600 sm:w-auto"
        >
          <Plus aria-hidden className="size-4" />
          Novo artigo
        </Link>
      </header>

      {artigos.length === 0 ? (
        <div className="mt-8 border border-areia-200 bg-white p-6 sm:mt-10 sm:p-8">
          <h2 className="font-serif text-[1.25rem] text-bordo-900">
            A lista está vazia
          </h2>
          <p className="mt-3 max-w-[60ch] text-[0.9375rem] text-grafite-600">
            Os cinco artigos que hoje aparecem no site ainda estão no código.
            Traga-os para o painel de uma vez só. Depois disso, eles podem ser
            editados e apagados por aqui como qualquer outro.
          </p>
          <div className="mt-6">
            <BotaoImportar />
          </div>
        </div>
      ) : (
        <>
          <nav
            aria-label="Filtrar artigos"
            className="mt-8 flex items-center gap-1 overflow-x-auto border-b border-areia-200 sm:mt-10 sm:flex-wrap sm:overflow-x-visible"
          >
            {FILTROS.map((item) => {
              const selecionado = item.chave === ativo;
              return (
                <Link
                  key={item.chave}
                  href={
                    item.chave === "todos" ? "/admin" : `/admin?filtro=${item.chave}`
                  }
                  aria-current={selecionado ? "page" : undefined}
                  className={cn(
                    "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[0.9375rem] font-medium whitespace-nowrap transition-colors sm:px-4",
                    selecionado
                      ? "border-bordo-700 text-bordo-900"
                      : "border-transparent text-grafite-600 hover:text-bordo-700",
                  )}
                >
                  {item.rotulo}
                  <span
                    className={cn(
                      "inline-flex min-w-6 items-center justify-center rounded-[2px] px-1.5 py-0.5 text-[0.75rem]",
                      selecionado
                        ? "bg-bordo-700 text-white"
                        : "bg-areia-100 text-grafite-600",
                    )}
                  >
                    {contagem[item.chave]}
                  </span>
                </Link>
              );
            })}
          </nav>

          {visiveis.length === 0 ? (
            <p className="mt-8 border border-areia-200 bg-white p-6 text-[0.9375rem] text-grafite-600 sm:mt-10 sm:p-8">
              {ativo === "rascunhos"
                ? "Nenhum rascunho no momento: tudo que existe já está no site."
                : "Nenhum artigo publicado no momento."}
            </p>
          ) : (
            <ul className="mt-6 flex flex-col gap-3">
              {visiveis.map((artigo) => (
                <li
                  key={artigo.id}
                  className={cn(
                    "group flex flex-wrap items-start gap-x-4 gap-y-3 border border-areia-200 bg-white p-3 transition-colors hover:border-dourado-700/50 sm:items-center sm:gap-x-5 sm:gap-y-4 sm:p-4",
                    !artigo.published && "bg-areia-50/60",
                  )}
                >
                  {/* Miniatura da capa */}
                  <div className="relative aspect-[16/9] w-20 shrink-0 overflow-hidden rounded-[2px] border border-areia-200 bg-areia-100 sm:w-28">
                    {artigo.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={artigo.coverImage}
                        alt=""
                        loading="lazy"
                        className={cn(
                          "absolute inset-0 size-full object-cover transition-opacity",
                          !artigo.published && "opacity-60",
                        )}
                      />
                    ) : (
                      <span className="absolute inset-0 flex items-center justify-center">
                        <ImageOff
                          aria-hidden
                          className="size-4 text-grafite-400"
                        />
                      </span>
                    )}
                  </div>

                  {/* Texto */}
                  <div className="min-w-0 flex-1 sm:min-w-[14rem]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-grafite-600">
                      <span className="font-semibold tracking-[0.12em] text-dourado-700 uppercase">
                        {artigo.category}
                      </span>
                      <span aria-hidden className="h-3 w-px bg-areia-200" />
                      <time dateTime={artigo.date}>
                        {formatarData(artigo.date)}
                      </time>
                      <span aria-hidden className="h-3 w-px bg-areia-200" />
                      <span className="inline-flex items-center gap-1">
                        <Clock aria-hidden className="size-3" />
                        {artigo.readingTime} min
                      </span>
                    </div>

                    <h2 className="mt-1.5 font-serif text-[1.0625rem] text-bordo-900">
                      <Link
                        href={`/admin/artigos/${artigo.id}`}
                        className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-dourado-700"
                      >
                        {artigo.title}
                      </Link>
                    </h2>

                    <p className="mt-1 line-clamp-1 text-[0.875rem] text-grafite-600">
                      {artigo.excerpt}
                    </p>
                  </div>

                  {/* Ações */}
                  <div className="flex w-full items-center justify-between gap-4 border-t border-areia-200 pt-3 sm:w-auto sm:justify-start sm:gap-5 sm:border-0 sm:pt-0">
                    <InterruptorPublicacao
                      id={artigo.id}
                      titulo={artigo.title}
                      publicado={artigo.published}
                    />

                    <Link
                      href={`/admin/artigos/${artigo.id}`}
                      className="inline-flex h-10 items-center gap-1.5 rounded-[2px] border border-areia-200 px-4 text-[0.875rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700 sm:px-3"
                    >
                      <Pencil aria-hidden className="size-3.5" />
                      Editar
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
