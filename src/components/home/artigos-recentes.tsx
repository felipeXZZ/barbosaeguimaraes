import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { CardArtigo } from "@/components/shared/card-artigo";
import { Container } from "@/components/shared/container";
import { Revelar } from "@/components/shared/revelar";
import { SectionHeading } from "@/components/shared/section-heading";
import { artigosRecentes } from "@/content/artigos";

export function ArtigosRecentes() {
  const artigos = artigosRecentes(3);

  if (artigos.length === 0) return null;

  return (
    <section
      aria-labelledby="artigos-titulo"
      className="border-b border-areia-200 py-16 lg:py-24"
    >
      <Container>
        <Revelar>
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              sobrancelha="Artigos"
              titulo="Conteúdo técnico produzido pelo escritório"
              descricao="Textos informativos sobre temas jurídicos de interesse geral."
              id="artigos-titulo"
            />
            <Link
              href="/artigos"
              className="hidden shrink-0 items-center gap-2 text-[0.9375rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4 transition-colors hover:text-bordo-900 md:inline-flex"
            >
              Ver todos os artigos
              <ArrowRight aria-hidden className="size-4" />
            </Link>
          </div>
        </Revelar>

        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {artigos.map((artigo, indice) => (
            <li key={artigo.slug}>
              <Revelar atraso={indice * 0.08} className="h-full">
                <CardArtigo artigo={artigo} />
              </Revelar>
            </li>
          ))}
        </ul>

        <Link
          href="/artigos"
          className="mt-8 inline-flex items-center gap-2 text-[0.9375rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4 md:hidden"
        >
          Ver todos os artigos
          <ArrowRight aria-hidden className="size-4" />
        </Link>
      </Container>
    </section>
  );
}
