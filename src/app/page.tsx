import type { Metadata } from "next";

import { ArtigosRecentes } from "@/components/home/artigos-recentes";
import { ComoFunciona } from "@/components/home/como-funciona";
import { ContatoFinal } from "@/components/home/contato-final";
import { FaixaCredenciais } from "@/components/home/faixa-credenciais";
import { GradeAreas } from "@/components/home/grade-areas";
import { Hero } from "@/components/home/hero";
import { SocioFundador } from "@/components/home/socio-fundador";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: `${site.nome} | Advocacia em São Paulo desde ${site.fundacao}`,
  description:
    "Escritório de advocacia no centro de São Paulo, atuante desde 1999 em dez áreas do direito, com atendimento em todo o território nacional. Fale com o escritório.",
  alternates: { canonical: "/" },
};

export default function PaginaInicial() {
  return (
    <>
      <Hero />
      <FaixaCredenciais />
      <GradeAreas />
      <SocioFundador />
      <ComoFunciona />
      <ArtigosRecentes />
      <ContatoFinal />
    </>
  );
}
