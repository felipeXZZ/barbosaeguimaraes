import type { Metadata } from "next";
import { ArrowRight, Check, HelpCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DadosEstruturados } from "@/components/shared/dados-estruturados";
import { CabecalhoPagina } from "@/components/shared/cabecalho-pagina";
import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { FormularioContato } from "@/components/shared/formulario-contato";
import { Imagem } from "@/components/shared/imagem";
import { Revelar } from "@/components/shared/revelar";
import { Filete } from "@/components/shared/section-heading";
import { areas, buscarArea } from "@/content/areas";
import { site } from "@/content/site";
import { jsonLdArea, jsonLdMigalhas } from "@/lib/jsonld";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const area = buscarArea(slug);

  if (!area) {
    return { title: "Área não encontrada" };
  }

  return {
    title: `${area.titulo} em São Paulo`,
    description: area.metaDescricao,
    alternates: { canonical: `/areas-de-atuacao/${area.slug}` },
    openGraph: {
      title: `${area.titulo} | ${site.nomeCurto} Advogados`,
      description: area.metaDescricao,
      url: `${site.url}/areas-de-atuacao/${area.slug}`,
      type: "article",
    },
  };
}

export default async function PaginaArea({ params }: Props) {
  const { slug } = await params;
  const area = buscarArea(slug);

  if (!area) notFound();

  const outrasAreas = areas.filter((item) => item.slug !== area.slug).slice(0, 6);

  const dadosArea = jsonLdArea(area.slug);

  return (
    <>
      {dadosArea ? <DadosEstruturados dados={dadosArea} /> : null}
      <DadosEstruturados
        dados={jsonLdMigalhas([
          { nome: "Áreas de atuação", caminho: "/areas-de-atuacao" },
          { nome: area.nome, caminho: `/areas-de-atuacao/${area.slug}` },
        ])}
      />
      <CabecalhoPagina
        sobrancelha="Área de atuação"
        titulo={`${area.titulo} no centro de São Paulo`}
        descricao={area.resumoCurto}
        migalhas={[
          { rotulo: "Áreas de atuação", href: "/areas-de-atuacao" },
          { rotulo: area.nome },
        ]}
      />

      {/* Resumo e imagem */}
      <section
        aria-labelledby="fazemos-titulo"
        className="border-b border-areia-200 py-16 lg:py-24"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Revelar className="lg:col-span-7">
              <span className="sobrancelha">O que fazemos</span>
              <Filete className="mt-4" />
              <h2
                id="fazemos-titulo"
                className="mt-6 text-[1.75rem] sm:text-[2.125rem]"
              >
                Como o escritório atua em {area.nome}
              </h2>

              <div className="mt-6 flex flex-col gap-4 text-grafite-600">
                {area.descricao.map((paragrafo) => (
                  <p key={paragrafo.slice(0, 40)}>{paragrafo}</p>
                ))}
              </div>

              <h3 className="mt-10 font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-700">
                Assuntos atendidos
              </h3>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {area.subtemas.map((subtema) => (
                  <li
                    key={subtema}
                    className="flex items-start gap-2 text-[0.9375rem] text-grafite-900"
                  >
                    <Check
                      aria-hidden
                      className="mt-1 size-4 shrink-0 text-dourado-700"
                    />
                    {subtema}
                  </li>
                ))}
              </ul>
            </Revelar>

            <Revelar atraso={0.1} className="lg:col-span-5">
              <Imagem
                src={area.imagem}
                alt={area.imagemAlt}
                legenda={`Imagem da área de ${area.nome}, proporção 3:2`}
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[3/2] w-full"
              />
            </Revelar>
          </div>
        </Container>
      </section>

      {/* Quando procurar */}
      <section
        aria-labelledby="quando-titulo"
        className="bg-areia-100 py-16 lg:py-24"
      >
        <Container>
          <Revelar>
            <span className="sobrancelha">Quando procurar o escritório</span>
            <Filete className="mt-4" />
            <h2
              id="quando-titulo"
              className="mt-6 max-w-[24ch] text-[1.75rem] sm:text-[2.125rem]"
            >
              Situações em que vale buscar orientação
            </h2>
          </Revelar>

          <ul className="mt-10 grid gap-px bg-areia-200 sm:grid-cols-2">
            {area.quandoProcurar.map((situacao, indice) => (
              <li key={situacao} className="bg-areia-100">
                <Revelar atraso={indice * 0.06} className="h-full">
                  <div className="flex h-full items-start gap-4 p-6">
                    <HelpCircle
                      aria-hidden
                      className="mt-1 size-5 shrink-0 text-dourado-700"
                    />
                    <p className="text-[0.9375rem] text-grafite-900">
                      {situacao}
                    </p>
                  </div>
                </Revelar>
              </li>
            ))}
          </ul>

          <Revelar>
            <p className="mt-8 max-w-[68ch] text-[0.9375rem] text-grafite-600">
              Esta página tem finalidade informativa e não substitui a análise
              do caso concreto. Prazos processuais correm independentemente do
              conhecimento da parte, por isso a orientação em tempo hábil faz
              diferença no encaminhamento.
            </p>
          </Revelar>
        </Container>
      </section>

      {/* Contato */}
      <section
        aria-labelledby="contato-area-titulo"
        className="sobre-bordo bg-bordo-900 py-16 text-areia-50 lg:py-24"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <Revelar className="lg:col-span-5">
              <span className="sobrancelha">Contato</span>
              <Filete className="mt-4" />
              <h2
                id="contato-area-titulo"
                className="mt-6 text-[1.75rem] sm:text-[2.125rem]"
              >
                Fale sobre a sua questão de {area.nome.toLowerCase()}
              </h2>
              <p className="mt-5 max-w-[46ch] text-areia-200">
                Ao enviar a mensagem pelo WhatsApp, o assunto já vai
                identificado como {area.nome.toLowerCase()}, o que agiliza o
                direcionamento interno.
              </p>
              <div className="mt-8">
                <CtaWhatsApp
                  origem={`area_${area.slug}`}
                  variant="claro"
                  size="lg"
                />
              </div>
            </Revelar>

            <Revelar atraso={0.1} className="lg:col-span-7">
              <div className="border border-areia-50/20 p-6 lg:p-8">
                <h3 className="font-serif text-[1.25rem]">
                  Ou envie os detalhes por escrito
                </h3>
                <p className="mt-2 mb-6 text-[0.9375rem] text-areia-200">
                  A área já vem selecionada como {area.nome}.
                </p>
                <FormularioContato
                  tema="escuro"
                  areaPreSelecionada={area.slug}
                  origem={`area_${area.slug}`}
                />
              </div>
            </Revelar>
          </div>
        </Container>
      </section>

      {/* Outras áreas */}
      <section aria-labelledby="outras-titulo" className="py-16 lg:py-20">
        <Container>
          <h2
            id="outras-titulo"
            className="font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-700"
          >
            Outras áreas de atuação
          </h2>
          <span aria-hidden className="mt-4 block h-px w-8 bg-dourado-700" />

          <ul className="mt-6 flex flex-wrap gap-3">
            {outrasAreas.map((outra) => (
              <li key={outra.slug}>
                <Link
                  href={`/areas-de-atuacao/${outra.slug}`}
                  className="inline-flex items-center gap-2 border border-areia-200 px-4 py-2 text-[0.875rem] text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700"
                >
                  {outra.nome}
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </li>
            ))}
          </ul>

          <Link
            href="/areas-de-atuacao"
            className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4"
          >
            Ver todas as áreas
            <ArrowRight aria-hidden className="size-4" />
          </Link>
        </Container>
      </section>
    </>
  );
}
