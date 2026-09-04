import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CarrosselHero } from "@/components/home/carrossel-hero";
import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { Imagem } from "@/components/shared/imagem";
import { Button } from "@/components/ui/button";
import { anosDeAtuacao, site } from "@/content/site";
import { totalAreas } from "@/content/areas";

export function Hero() {
  const anos = anosDeAtuacao();

  return (
    <section
      aria-labelledby="hero-titulo"
      className="sobre-bordo relative isolate flex min-h-[32rem] items-center bg-bordo-900 md:min-h-[36rem] lg:min-h-[85vh]"
    >
      <Imagem
        src="/images/hero/hero-escritorio.jpg"
        alt=""
        legenda="Fotografia do escritório ou do entorno da Praça João Mendes, no centro de São Paulo"
        sizes="100vw"
        priority
        blur
        tratamento="pb"
        overlayForte
        className="absolute inset-0 -z-10 h-full w-full"
      />

      <Container className="py-16 lg:py-20">
        {/*
          No celular a ordem é a do código: sobrancelha e título, o carrossel
          logo abaixo e então texto e botões. A partir de lg o carrossel sai
          para a coluna da direita e ocupa as duas linhas.
        */}
        <div className="grid gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-x-28 lg:gap-y-8">
          <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
            <div className="flex items-center gap-3">
              <span aria-hidden className="filete w-8" />
              <span className="sobrancelha">
                {site.oab} · {anos} anos de atuação
              </span>
            </div>

            <h1
              id="hero-titulo"
              className="mt-6 text-[2.125rem] text-areia-50 sm:text-[2.75rem] lg:text-[3.25rem]"
            >
              Advocacia técnica e institucional desde {site.fundacao}
            </h1>
          </div>

          <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-center">
            <CarrosselHero />
          </div>

          <div className="lg:col-start-1 lg:row-start-2 lg:self-start">
            <p className="max-w-[54ch] text-[1.0625rem] text-areia-50 sm:text-[1.125rem]">
              Atuação em {totalAreas} áreas do direito, a partir do centro de São
              Paulo, com acompanhamento de causas em todo o território nacional.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
              <CtaWhatsApp
                origem="hero"
                variant="claro"
                size="lg"
                className="w-full sm:w-auto"
              />

              <Button asChild variant="contornoClaro" size="lg" className="w-full sm:w-auto">
                <Link href="/areas-de-atuacao">
                  Conhecer as áreas de atuação
                  <ArrowRight aria-hidden />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
