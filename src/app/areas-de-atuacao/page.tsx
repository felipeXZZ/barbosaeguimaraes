import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CabecalhoPagina } from "@/components/shared/cabecalho-pagina";
import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { Revelar } from "@/components/shared/revelar";
import { areas, totalAreas } from "@/content/areas";

export const metadata: Metadata = {
  title: "Áreas de atuação",
  description:
    "As dez áreas do direito atendidas pelo Barbosa e Guimarães Advogados Associados, no centro de São Paulo: bancário, cível, penal, trabalhista, empresarial, ambiental, desportivo, autoral, sindical e tributário.",
  alternates: { canonical: "/areas-de-atuacao" },
};

export default function PaginaAreas() {
  return (
    <>
      <CabecalhoPagina
        sobrancelha="Áreas de atuação"
        titulo={`${totalAreas} áreas do direito atendidas pelo escritório`}
        descricao="Cada área tem uma página própria, com o que o escritório faz, em que situações procurar e o canal direto de contato."
        migalhas={[{ rotulo: "Áreas de atuação" }]}
      />

      <section className="py-16 lg:py-24">
        <Container>
          <ul className="grid gap-px bg-areia-200 sm:grid-cols-2 lg:grid-cols-3">
            {areas.map((area, indice) => (
              <li key={area.slug} className="bg-areia-50">
                <Revelar atraso={(indice % 3) * 0.06} className="h-full">
                  <Link
                    href={`/areas-de-atuacao/${area.slug}`}
                    className="group flex h-full flex-col gap-4 p-6 transition-colors hover:bg-areia-100 lg:p-8"
                  >
                    <area.icone
                      aria-hidden
                      className="size-6 text-dourado-700 transition-colors group-hover:text-bordo-700"
                    />
                    <h2 className="font-serif text-[1.25rem] text-bordo-900">
                      {area.nome}
                    </h2>
                    <p className="text-[0.9375rem] text-grafite-600">
                      {area.resumoCurto}
                    </p>
                    <ul className="flex flex-wrap gap-2 pt-1">
                      {area.subtemas.slice(0, 3).map((subtema) => (
                        <li
                          key={subtema}
                          className="border border-areia-200 px-2 py-1 text-[0.75rem] text-grafite-600"
                        >
                          {subtema}
                        </li>
                      ))}
                    </ul>
                    <span className="mt-auto inline-flex items-center gap-2 pt-3 text-[0.875rem] font-medium text-bordo-700">
                      Ver a área
                      <ArrowRight
                        aria-hidden
                        className="size-4 transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </Link>
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
                Não sabe em qual área o seu caso se enquadra?
              </h2>
              <p className="mt-3 max-w-[54ch] text-areia-200">
                Descreva a situação em poucas linhas. O escritório indica a área
                correspondente e o profissional responsável.
              </p>
            </div>
            <CtaWhatsApp origem="indice_areas" variant="claro" size="lg" />
          </div>
        </Container>
      </section>
    </>
  );
}
