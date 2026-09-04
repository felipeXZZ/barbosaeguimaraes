import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Imagem } from "@/components/shared/imagem";
import { Revelar } from "@/components/shared/revelar";
import { Filete } from "@/components/shared/section-heading";
import { socioFundador } from "@/content/equipe";

/**
 * Chamada do sócio fundador na home. Aqui vai só o essencial e as credenciais
 * em destaque; a biografia completa fica na página da equipe, que é onde o
 * visitante já foi atrás do detalhe.
 */
export function SocioFundador() {
  const destaques = socioFundador.destaques ?? [];

  return (
    <section
      aria-labelledby="fundador-titulo"
      className="bg-areia-100 py-16 lg:py-24"
    >
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
          <Revelar className="lg:col-span-5">
            <div className="relative">
              {/* Mesmo filete deslocado do carrossel do topo, para dar unidade. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-0 top-0 hidden aspect-[3/4] translate-x-4 translate-y-4 border border-dourado-700/40 sm:block"
              />
              <Imagem
                src={socioFundador.foto}
                alt={socioFundador.fotoAlt}
                legenda="Retrato do sócio fundador, enquadramento vertical"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="relative aspect-[3/4] w-full"
              />
            </div>
          </Revelar>

          <Revelar atraso={0.1} className="lg:col-span-7">
            <span className="sobrancelha">Sócio fundador</span>
            <Filete className="mt-4" />

            <h2
              id="fundador-titulo"
              className="mt-6 text-[1.75rem] text-bordo-900 sm:text-[2.125rem]"
            >
              {socioFundador.nome}
            </h2>
            <p className="mt-2 text-[0.9375rem] text-bordo-700">
              Advogado, jurisconsulto e especialista em Direito Penal
            </p>

            {socioFundador.resumo ? (
              <p className="mt-6 max-w-[56ch] text-grafite-600">
                {socioFundador.resumo}
              </p>
            ) : null}

            {destaques.length > 0 ? (
              <ul className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                {destaques.map(({ icone: Icone, rotulo, detalhe }) => (
                  <li key={rotulo} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center border border-dourado-700/40 bg-areia-50"
                    >
                      <Icone className="size-4 text-dourado-700" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[0.9375rem] leading-snug font-medium text-bordo-900">
                        {rotulo}
                      </span>
                      {detalhe ? (
                        <span className="text-[0.8125rem] leading-snug text-grafite-600">
                          {detalhe}
                        </span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}

            <Link
              href="/equipe"
              className="mt-10 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4 transition-colors hover:text-bordo-900"
            >
              Ler a trajetória completa
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </Revelar>
        </div>
      </Container>
    </section>
  );
}
