import type { Metadata } from "next";
import { Check } from "lucide-react";

import { DadosEstruturados } from "@/components/shared/dados-estruturados";
import { CabecalhoPagina } from "@/components/shared/cabecalho-pagina";
import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { Imagem } from "@/components/shared/imagem";
import { Revelar } from "@/components/shared/revelar";
import { Filete, SectionHeading } from "@/components/shared/section-heading";
import { equipe, socioFundador } from "@/content/equipe";
import { jsonLdMigalhas, jsonLdPessoa } from "@/lib/jsonld";

export const metadata: Metadata = {
  title: "Equipe",
  description:
    "Advogados e profissionais do Barbosa e Guimarães Advogados Associados: qualificação, cargos e filiações institucionais de cada integrante da equipe.",
  alternates: { canonical: "/equipe" },
};

export default function PaginaEquipe() {
  const demais = equipe.filter((membro) => !membro.destaque);

  return (
    <>
      {equipe.map((membro) => (
        <DadosEstruturados key={membro.slug} dados={jsonLdPessoa(membro)} />
      ))}
      <DadosEstruturados
        dados={jsonLdMigalhas([{ nome: "Equipe", caminho: "/equipe" }])}
      />
      <CabecalhoPagina
        sobrancelha="Equipe"
        titulo="Quem conduz os trabalhos do escritório"
        descricao="Advogados e profissionais de comunicação e gestão que integram a estrutura do escritório, com suas qualificações e filiações institucionais."
        migalhas={[{ rotulo: "Equipe" }]}
      />

      {/* Sócio fundador em destaque */}
      <section
        aria-labelledby="fundador-titulo"
        className="border-b border-areia-200 py-16 lg:py-24"
      >
        <Container>
          <Revelar>
            <div className="grid gap-10 border border-areia-200 bg-areia-100 p-6 lg:grid-cols-12 lg:gap-12 lg:p-10">
              <div className="lg:col-span-4">
                <Imagem
                  src={socioFundador.foto}
                  alt={socioFundador.fotoAlt}
                  legenda="Retrato do sócio fundador, enquadramento vertical 3:4"
                  sizes="(min-width: 1024px) 32vw, 100vw"
                  className="aspect-[3/4] w-full"
                />
              </div>

              <div className="lg:col-span-8">
                <span className="sobrancelha">{socioFundador.cargo}</span>
                <Filete className="mt-4" />
                <h2
                  id="fundador-titulo"
                  className="mt-5 text-[1.75rem] sm:text-[2.125rem]"
                >
                  {socioFundador.nome}
                </h2>

                <div className="mt-5 flex flex-col gap-4 text-grafite-600">
                  {socioFundador.bio?.map((paragrafo) => (
                    <p key={paragrafo.slice(0, 40)}>{paragrafo}</p>
                  ))}
                </div>

                <h3 className="mt-8 font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-700">
                  Qualificação
                </h3>
                <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                  {socioFundador.credenciais.map((credencial) => (
                    <li
                      key={credencial}
                      className="flex items-start gap-2 text-[0.9375rem] text-grafite-900"
                    >
                      <Check
                        aria-hidden
                        className="mt-1 size-4 shrink-0 text-dourado-700"
                      />
                      {credencial}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Revelar>
        </Container>
      </section>

      {/* Demais integrantes */}
      <section aria-labelledby="equipe-titulo" className="py-16 lg:py-24">
        <Container>
          <Revelar>
            <SectionHeading
              sobrancelha="Integrantes"
              titulo="Advogados e profissionais associados"
              id="equipe-titulo"
            />
          </Revelar>

          <ul className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {demais.map((membro, indice) => (
              <li key={membro.slug}>
                <Revelar atraso={(indice % 3) * 0.08} className="h-full">
                  <article className="flex h-full flex-col border border-areia-200 bg-areia-50">
                    <Imagem
                      src={membro.foto}
                      alt={membro.fotoAlt}
                      legenda={`Retrato de ${membro.nome}, proporção 3:4`}
                      sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
                      className="aspect-[3/4] w-full"
                    />
                    <div className="flex flex-1 flex-col gap-3 p-6">
                      <h3 className="font-serif text-[1.1875rem] text-bordo-900">
                        {membro.nome}
                      </h3>
                      <p className="text-[0.875rem] text-bordo-700">
                        {membro.cargo}
                      </p>
                      <span aria-hidden className="h-px w-8 bg-dourado-700" />
                      <ul className="flex flex-col gap-2">
                        {membro.credenciais.map((credencial) => (
                          <li
                            key={credencial}
                            className="flex items-start gap-2 text-[0.875rem] text-grafite-600"
                          >
                            <Check
                              aria-hidden
                              className="mt-1 size-3.5 shrink-0 text-dourado-700"
                            />
                            {credencial}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                </Revelar>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="sobre-bordo bg-bordo-900 py-14 text-areia-50">
        <Container>
          <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[1.5rem] sm:text-[1.75rem]">
                Precisa falar com um dos advogados?
              </h2>
              <p className="mt-3 max-w-[54ch] text-areia-200">
                Descreva a situação e o escritório indicará o profissional
                responsável pela área correspondente.
              </p>
            </div>
            <CtaWhatsApp origem="equipe" variant="claro" size="lg" />
          </div>
        </Container>
      </section>
    </>
  );
}
