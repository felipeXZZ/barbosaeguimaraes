import type { Metadata } from "next";

import { CabecalhoPagina } from "@/components/shared/cabecalho-pagina";
import { CardArtigo } from "@/components/shared/card-artigo";
import { Container } from "@/components/shared/container";
import { Revelar } from "@/components/shared/revelar";
import { artigosOrdenados } from "@/content/artigos";

export const metadata: Metadata = {
  title: "Artigos",
  description:
    "Textos informativos sobre direito tributário, penal, constitucional e sobre o exercício da advocacia, produzidos pelo Barbosa e Guimarães Advogados Associados.",
  alternates: { canonical: "/artigos" },
};

export default function PaginaArtigos() {
  return (
    <>
      <CabecalhoPagina
        sobrancelha="Artigos"
        titulo="Conteúdo técnico produzido pelo escritório"
        descricao="Textos informativos sobre temas jurídicos de interesse geral. Nenhum deles substitui a análise de um caso concreto."
        migalhas={[{ rotulo: "Artigos" }]}
      />

      <section className="py-16 lg:py-24">
        <Container>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {artigosOrdenados.map((artigo, indice) => (
              <li key={artigo.slug}>
                <Revelar atraso={(indice % 3) * 0.08} className="h-full">
                  <CardArtigo artigo={artigo} />
                </Revelar>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
