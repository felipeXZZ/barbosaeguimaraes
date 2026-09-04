import { Clock } from "lucide-react";
import Link from "next/link";

import { Imagem } from "@/components/shared/imagem";
import type { Artigo } from "@/types/content";
import { formatarData } from "@/lib/utils";

/**
 * Card de artigo. Substitui os cards amarelo-saturados com serifada vermelha
 * do site antigo: fundo claro, hierarquia clara e contraste medido.
 */
export function CardArtigo({
  artigo,
  sizes = "(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw",
}: {
  artigo: Artigo;
  sizes?: string;
}) {
  return (
    <article className="group relative isolate flex h-full flex-col border border-areia-200 bg-areia-50 transition-colors hover:bg-areia-100">
      <Imagem
        src={artigo.coverImage}
        alt={artigo.coverImageAlt}
        legenda={`Capa do artigo: ${artigo.title}`}
        sizes={sizes}
        className="aspect-[16/9] w-full"
      />

      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-grafite-600">
          <span className="font-semibold tracking-[0.12em] uppercase text-dourado-700">
            {artigo.category}
          </span>
          <span aria-hidden className="h-3 w-px bg-areia-200" />
          <time dateTime={artigo.date}>{formatarData(artigo.date)}</time>
          <span aria-hidden className="h-3 w-px bg-areia-200" />
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {artigo.readingTime} min de leitura
          </span>
        </div>

        <h3 className="font-serif text-[1.1875rem] text-bordo-900">
          <Link
            href={`/artigos/${artigo.slug}`}
            className="after:absolute after:inset-0 focus-visible:outline-none"
          >
            {artigo.title}
          </Link>
        </h3>

        <p className="text-[0.9375rem] text-grafite-600">{artigo.excerpt}</p>

        <span className="mt-auto pt-3 text-[0.875rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4">
          Ler o artigo
        </span>
      </div>
    </article>
  );
}
