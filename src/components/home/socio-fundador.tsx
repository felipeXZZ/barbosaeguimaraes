import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Imagem } from "@/components/shared/imagem";
import { Revelar } from "@/components/shared/revelar";
import { Filete } from "@/components/shared/section-heading";
import { socioFundador } from "@/content/equipe";

export function SocioFundador() {
  return (
    <section
      aria-labelledby="fundador-titulo"
      className="bg-areia-100 py-16 lg:py-24"
    >
      <Container>
        <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
          <Revelar className="lg:col-span-5">
            <Imagem
              src={socioFundador.foto}
              alt={socioFundador.fotoAlt}
              legenda="Retrato do sócio fundador, enquadramento vertical"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[3/4] w-full"
            />
          </Revelar>

          <Revelar atraso={0.1} className="lg:col-span-7">
            <span className="sobrancelha">Sócio fundador</span>
            <Filete className="mt-4" />

            <h2
              id="fundador-titulo"
              className="mt-6 text-[1.75rem] sm:text-[2.125rem]"
            >
              {socioFundador.nome}
            </h2>
            <p className="mt-2 text-[0.9375rem] text-bordo-700">
              Advogado, jurisconsulto e especialista em Direito Penal
            </p>

            <div className="mt-6 flex flex-col gap-4 text-grafite-600">
              {socioFundador.bio?.map((paragrafo) => (
                <p key={paragrafo.slice(0, 40)}>{paragrafo}</p>
              ))}
            </div>

            <Link
              href="/equipe"
              className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4 transition-colors hover:text-bordo-900"
            >
              Conhecer a equipe completa
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Revelar>
        </div>
      </Container>
    </section>
  );
}
