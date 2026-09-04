import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Revelar } from "@/components/shared/revelar";
import { SectionHeading } from "@/components/shared/section-heading";
import { areas } from "@/content/areas";

/**
 * Grade das dez áreas. No mobile vira carrossel horizontal com scroll-snap;
 * a partir de md volta a ser grade, sem duplicar marcação.
 */
export function GradeAreas() {
  return (
    <section
      aria-labelledby="areas-titulo"
      className="border-b border-areia-200 py-16 lg:py-24"
    >
      <Container>
        <Revelar>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              sobrancelha="Áreas de atuação"
              titulo="Dez áreas do direito, com equipe dedicada a cada uma"
              descricao="Cada área tem uma página própria, com o que fazemos, quando procurar o escritório e o canal direto de contato."
              id="areas-titulo"
            />
            <Link
              href="/areas-de-atuacao"
              className="hidden shrink-0 items-center gap-2 text-[0.9375rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4 transition-colors hover:text-bordo-900 md:inline-flex"
            >
              Ver todas as áreas
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </Revelar>
      </Container>

      <Container className="mt-12">
        <ul
          className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 sm:-mx-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0 lg:grid-cols-3"
          role="list"
        >
          {areas.map((area) => (
            <li
              key={area.slug}
              className="w-[78vw] shrink-0 snap-start sm:w-[52vw] md:w-auto"
            >
              <Link
                href={`/areas-de-atuacao/${area.slug}`}
                className="group flex h-full flex-col gap-4 border border-areia-200 bg-areia-50 p-6 transition-colors hover:bg-areia-100 lg:p-8"
              >
                <area.icone
                  aria-hidden
                  className="size-6 text-dourado-700 transition-colors group-hover:text-bordo-700"
                />
                <h3 className="font-serif text-[1.25rem] text-bordo-900">
                  {area.nome}
                </h3>
                <p className="text-[0.9375rem] text-grafite-600">
                  {area.resumoCurto}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-2 text-[0.875rem] font-medium text-bordo-700">
                  Ver a área
                  <ArrowRight
                    aria-hidden
                    className="size-4 transition-transform group-hover:translate-x-1"
                  />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/areas-de-atuacao"
          className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4 md:hidden"
        >
          Ver todas as áreas
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </Container>
    </section>
  );
}
