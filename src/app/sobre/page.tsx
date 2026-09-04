import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ClipboardCheck, Scale, ShieldCheck } from "lucide-react";

import { CabecalhoPagina } from "@/components/shared/cabecalho-pagina";
import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { Imagem } from "@/components/shared/imagem";
import { Revelar } from "@/components/shared/revelar";
import { Filete, SectionHeading } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";
import { totalAreas } from "@/content/areas";
import { anosDeAtuacao, site } from "@/content/site";

export const metadata: Metadata = {
  title: "O escritório",
  description:
    "Barbosa e Guimarães Advogados Associados: fundado em 1999, com sede na Praça João Mendes, no centro de São Paulo. Conheça a história, a filosofia de trabalho e a missão do escritório.",
  alternates: { canonical: "/sobre" },
};

const principios = [
  {
    icone: BookOpen,
    titulo: "Fundamento técnico",
    texto:
      "Cada tese é construída a partir da lei, da doutrina e da jurisprudência aplicável, com a correta interpretação da questão jurídica apresentada.",
  },
  {
    icone: ClipboardCheck,
    titulo: "Controladoria jurídica",
    texto:
      "O escritório foi pioneiro na criação de uma controladoria jurídica própria, que garante acompanhamento redobrado de prazos e andamentos processuais.",
  },
  {
    icone: Scale,
    titulo: "Atuação em diversas áreas",
    texto:
      "A estrutura reúne profissionais de áreas distintas do direito, o que permite tratar questões que envolvem mais de uma matéria em conjunto.",
  },
  {
    icone: ShieldCheck,
    titulo: "Sigilo profissional",
    texto:
      "As informações confiadas ao escritório são protegidas pelo sigilo profissional previsto no artigo 34 do Estatuto da Advocacia.",
  },
];

export default function PaginaSobre() {
  const anos = anosDeAtuacao();

  return (
    <>
      <CabecalhoPagina
        sobrancelha="O escritório"
        titulo={`Advocacia construída ao longo de ${anos} anos`}
        descricao="Fundado em 1999, o Barbosa e Guimarães Advogados Associados presta serviços jurídicos a pessoas físicas e empresas, com sede no centro de São Paulo e parcerias em todo o território nacional."
        migalhas={[{ rotulo: "O escritório" }]}
      />

      {/* Nossa história */}
      <section
        aria-labelledby="historia-titulo"
        className="border-b border-areia-200 py-16 lg:py-24"
      >
        <Container>
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <Revelar className="lg:col-span-7">
              <SectionHeading
                sobrancelha="Nossa história"
                titulo="Do primeiro escritório à estrutura atual"
                id="historia-titulo"
              />
              <div className="mt-6 flex flex-col gap-4 text-grafite-600">
                <p>
                  O escritório foi fundado em {site.fundacao} com um objetivo
                  simples de enunciar e exigente de cumprir: prestar serviços
                  jurídicos de qualidade técnica consistente, com soluções
                  adequadas a cada situação apresentada.
                </p>
                <p>
                  Ao longo de {anos} anos, a estrutura cresceu e passou a reunir
                  advogados e profissionais de áreas distintas, o que permitiu
                  ampliar a atuação para {totalAreas} áreas do direito, do
                  criminal ao tributário, do trabalhista ao ambiental.
                </p>
                <p>
                  A sede permanece no centro de São Paulo, na Praça Dr. João
                  Mendes, ao lado do Fórum João Mendes Júnior — proximidade que
                  facilita o acompanhamento presencial de processos e o
                  atendimento a clientes que precisam comparecer a audiências.
                </p>
              </div>
            </Revelar>

            <Revelar atraso={0.1} className="lg:col-span-5">
              <Imagem
                src="/images/hero/escritorio-sede.jpg"
                alt="Sede do escritório Barbosa e Guimarães, na Praça Dr. João Mendes, centro de São Paulo"
                legenda="Fachada ou interior da sede, na Praça João Mendes"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] w-full"
              />
            </Revelar>
          </div>
        </Container>
      </section>

      {/* Filosofia */}
      <section
        aria-labelledby="filosofia-titulo"
        className="bg-areia-100 py-16 lg:py-24"
      >
        <Container>
          <Revelar>
            <SectionHeading
              sobrancelha="Filosofia"
              titulo="Como o escritório trabalha"
              descricao="A atuação se apoia em quatro compromissos permanentes, aplicados a qualquer área do direito."
              id="filosofia-titulo"
            />
          </Revelar>

          <ul className="mt-12 grid gap-px bg-areia-200 sm:grid-cols-2">
            {principios.map((principio, indice) => (
              <li key={principio.titulo} className="bg-areia-100">
                <Revelar atraso={indice * 0.06} className="h-full">
                  <div className="flex h-full flex-col gap-4 p-6 lg:p-8">
                    <principio.icone
                      aria-hidden
                      className="size-6 text-dourado-700"
                    />
                    <h3 className="font-serif text-[1.1875rem] text-bordo-900">
                      {principio.titulo}
                    </h3>
                    <p className="text-[0.9375rem] text-grafite-600">
                      {principio.texto}
                    </p>
                  </div>
                </Revelar>
              </li>
            ))}
          </ul>

          <Revelar>
            <p className="mt-10 max-w-[68ch] text-grafite-600">
              O escritório mantém parcerias em todo o território nacional, o que
              permite acompanhar causas fora de São Paulo sem perda de contato
              com o cliente. O princípio que orienta o trabalho é a defesa dos
              direitos do cliente com presteza e dedicação, dentro dos limites
              da lei e da ética profissional.
            </p>
          </Revelar>
        </Container>
      </section>

      {/* Missão */}
      <section
        aria-labelledby="missao-titulo"
        className="border-b border-areia-200 py-16 lg:py-24"
      >
        <Container estreito>
          <Revelar>
            <span className="sobrancelha">Missão</span>
            <Filete className="mt-4" />
            <h2
              id="missao-titulo"
              className="mt-6 text-[1.75rem] sm:text-[2.125rem]"
            >
              Ética, dedicação e conhecimento jurídico
            </h2>
            <div className="mt-6 flex flex-col gap-4 text-grafite-600">
              <p>
                Prestar serviços jurídicos orientados pela ética, pela dedicação
                e pelo conhecimento técnico, com soluções estratégicas
                construídas caso a caso.
              </p>
              <p>
                A relação com o cliente se apoia em transparência sobre o que
                está sendo feito, sobre os prazos envolvidos e sobre os riscos
                de cada caminho possível — informação honesta, sem promessa de
                resultado.
              </p>
            </div>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <CtaWhatsApp origem="sobre" />
              <Button asChild variant="contorno">
                <Link href="/equipe">Conhecer a equipe</Link>
              </Button>
            </div>
          </Revelar>
        </Container>
      </section>
    </>
  );
}
