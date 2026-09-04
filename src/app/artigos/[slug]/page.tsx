import type { Metadata } from "next";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DadosEstruturados } from "@/components/shared/dados-estruturados";
import { CardArtigo } from "@/components/shared/card-artigo";
import { ConteudoMarkdown } from "@/components/shared/conteudo-markdown";
import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { Imagem } from "@/components/shared/imagem";
import { Revelar } from "@/components/shared/revelar";
import { Filete } from "@/components/shared/section-heading";
import { artigos, artigosOrdenados, buscarArtigo } from "@/content/artigos";
import { site } from "@/content/site";
import { jsonLdArtigo, jsonLdMigalhas } from "@/lib/jsonld";
import { formatarData } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return artigos.map((artigo) => ({ slug: artigo.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artigo = buscarArtigo(slug);

  if (!artigo) {
    return { title: "Artigo não encontrado" };
  }

  return {
    title: artigo.title,
    description: artigo.excerpt,
    alternates: { canonical: `/artigos/${artigo.slug}` },
    openGraph: {
      type: "article",
      title: artigo.title,
      description: artigo.excerpt,
      url: `${site.url}/artigos/${artigo.slug}`,
      publishedTime: artigo.date,
      authors: [artigo.author],
    },
  };
}

export default async function PaginaArtigo({ params }: Props) {
  const { slug } = await params;
  const artigo = buscarArtigo(slug);

  if (!artigo) notFound();

  const relacionados = artigosOrdenados
    .filter((item) => item.slug !== artigo.slug)
    .slice(0, 3);

  return (
    <>
      <DadosEstruturados dados={jsonLdArtigo(artigo)} />
      <DadosEstruturados
        dados={jsonLdMigalhas([
          { nome: "Artigos", caminho: "/artigos" },
          { nome: artigo.title, caminho: `/artigos/${artigo.slug}` },
        ])}
      />
      <article>
        {/* Cabeçalho do artigo */}
        <header className="sobre-bordo bg-bordo-900 py-12 text-areia-50 lg:py-16">
          <Container estreito>
            <Link
              href="/artigos"
              className="inline-flex items-center gap-2 text-[0.8125rem] text-areia-200 transition-colors hover:text-dourado-400"
            >
              <ArrowLeft aria-hidden className="size-3.5" />
              Todos os artigos
            </Link>

            <span className="sobrancelha mt-8 block">{artigo.category}</span>
            <Filete className="mt-4" />

            <h1 className="mt-6 text-[1.875rem] sm:text-[2.375rem] lg:text-[2.75rem]">
              {artigo.title}
            </h1>

            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-[0.875rem] text-areia-200">
              <time dateTime={artigo.date}>{formatarData(artigo.date)}</time>
              <span aria-hidden className="h-3 w-px bg-dourado-500" />
              <span className="inline-flex items-center gap-1.5">
                <Clock aria-hidden className="size-3.5" />
                {artigo.readingTime} min de leitura
              </span>
              <span aria-hidden className="h-3 w-px bg-dourado-500" />
              <span>{artigo.author}</span>
            </div>
          </Container>
        </header>

        <Container estreito className="py-12 lg:py-16">
          <Imagem
            src={artigo.coverImage}
            alt={artigo.coverImageAlt}
            legenda={`Capa do artigo: ${artigo.title}`}
            sizes="(min-width: 768px) 736px, 100vw"
            className="aspect-[16/9] w-full"
            priority
          />

          <p className="mt-10 border-l-2 border-dourado-700 pl-5 text-[1.0625rem] text-grafite-900">
            {artigo.excerpt}
          </p>

          <div className="mt-10">
            <ConteudoMarkdown conteudo={artigo.content} />
          </div>

          <p className="mt-12 border-t border-areia-200 pt-6 text-[0.8125rem] text-grafite-600">
            Conteúdo de caráter informativo, publicado em{" "}
            {formatarData(artigo.date)}. Não constitui orientação jurídica para
            casos concretos nem oferta de serviços.
          </p>
        </Container>
      </article>

      {/* Contato */}
      <section className="sobre-bordo bg-bordo-900 py-14 text-areia-50">
        <Container>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[1.5rem] sm:text-[1.75rem]">
                Ficou com uma dúvida sobre este tema?
              </h2>
              <p className="mt-3 max-w-[54ch] text-areia-200">
                O escritório pode avaliar como o assunto se aplica à sua
                situação.
              </p>
            </div>
            <CtaWhatsApp
              origem={`artigo_${artigo.slug}`}
              variant="claro"
              size="lg"
            >
              Tirar uma dúvida
            </CtaWhatsApp>
          </div>
        </Container>
      </section>

      {/* Relacionados */}
      {relacionados.length > 0 ? (
        <section aria-labelledby="relacionados-titulo" className="py-16 lg:py-20">
          <Container>
            <h2
              id="relacionados-titulo"
              className="font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-700"
            >
              Outros artigos
            </h2>
            <span aria-hidden className="mt-4 block h-px w-8 bg-dourado-700" />

            <ul className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relacionados.map((item, indice) => (
                <li key={item.slug}>
                  <Revelar atraso={indice * 0.08} className="h-full">
                    <CardArtigo artigo={item} />
                  </Revelar>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}
    </>
  );
}
