import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { Imagem } from "@/components/shared/imagem";
import { Button } from "@/components/ui/button";
import { anosDeAtuacao, site } from "@/content/site";
import { totalAreas } from "@/content/areas";

/** Escudo recortado do brasão, já sem o fundo branco da arte original. */
const ESCUDO = "/images/hero/brasao-escudo.png";

/**
 * Topo da home: a assinatura do escritório centralizada, ocupando a tela
 * inteira. O nome é texto de verdade, e não a arte do brasão em bitmap, para
 * escalar sem borrar e para o buscador ler o h1. A foto ao fundo entra apenas
 * como textura, em preto e branco sob véu bordô: quem chega precisa ver a
 * marca primeiro, não uma fotografia disputando a leitura.
 *
 * A abertura se monta em cadeia, do escudo aos botões, com as classes .entra*
 * e .atraso-* definidas em globals.css. Sem framer-motion aqui de propósito:
 * este é o elemento de maior contentful paint da página e não pode ficar
 * dependendo de hidratação para existir.
 */
export function Hero() {
  const anos = anosDeAtuacao();

  return (
    <section
      aria-labelledby="hero-titulo"
      className="sobre-bordo relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-bordo-900 lg:min-h-[calc(100svh-5rem)]"
    >
      <Imagem
        src="/images/hero/hermes-tribuna.jpg"
        alt=""
        legenda="Fotografia do escritório ou do entorno da Praça João Mendes, no centro de São Paulo"
        sizes="100vw"
        priority
        blur
        tratamento="pb"
        overlayForte
        className="entra-fundo absolute inset-0 -z-10 h-full w-full"
      />

      {/* Vinheta: apaga as bordas para o centro do quadro ficar com a marca. */}
      <span
        aria-hidden
        className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(28,6,8,0.55)_70%,rgba(28,6,8,0.9)_100%)]"
      />

      <Container className="py-14 sm:py-16">
        <div className="flex flex-col items-center text-center">
          <span className="sobrancelha entra atraso-1">
            {site.oab} · desde {site.fundacao}
          </span>

          <Image
            src={ESCUDO}
            alt=""
            width={295}
            height={366}
            priority
            quality={95}
            sizes="128px"
            className="entra-crescendo atraso-2 mt-6 h-24 w-auto drop-shadow-[0_18px_40px_rgba(0,0,0,0.6)] sm:mt-8 sm:h-28 lg:h-32"
          />

          <h1
            id="hero-titulo"
            className="mt-7 flex flex-col items-center gap-4 sm:mt-9"
          >
            <span className="entra atraso-3 block text-[clamp(2.125rem,8.6vw,5.75rem)] leading-[1.05] text-areia-50">
              Barbosa e Guimarães
            </span>
            {/* O filete se abre a partir do centro, sob o nome. */}
            <span className="entra-riscando atraso-4 flex w-full max-w-[36rem] items-center gap-4">
              <span aria-hidden className="filete h-px flex-1" />
              <span className="font-sans text-[0.6875rem] font-semibold tracking-[0.3em] text-dourado-400 uppercase sm:text-xs">
                Advogados Associados
              </span>
              <span aria-hidden className="filete h-px flex-1" />
            </span>
          </h1>

          <p className="entra atraso-5 mt-7 max-w-[26ch] text-center font-serif text-[1.5rem] leading-snug text-areia-50 sm:mt-8 sm:max-w-none sm:text-[1.875rem] lg:text-[2.25rem]">
            Advocacia técnica e institucional
          </p>

          <p className="entra atraso-5 mt-4 max-w-[52ch] text-center text-[1rem] text-areia-50/85 sm:text-[1.0625rem]">
            {anos} anos de atuação em {totalAreas} áreas do direito, a partir do
            centro de São Paulo, com acompanhamento de causas em todo o
            território nacional.
          </p>

          <div className="entra atraso-6 mt-9 flex w-full flex-col gap-3 sm:mt-10 sm:w-auto sm:flex-row sm:items-center sm:justify-center">
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
      </Container>
    </section>
  );
}
