import { ChevronRight } from "lucide-react";
import Link from "next/link";

import { Container } from "@/components/shared/container";

export interface Migalha {
  rotulo: string;
  href?: string;
}

/**
 * Cabeçalho das páginas internas: bloco bordô com trilha de navegação,
 * um único H1 e resumo. Substitui o banner genérico do site antigo.
 *
 * Entra em cadeia ao abrir a página, na mesma cadência da home. A animação é
 * a mesma da abertura: CSS puro, para não nascer invisível no HTML.
 */
export function CabecalhoPagina({
  sobrancelha,
  titulo,
  descricao,
  migalhas = [],
}: {
  sobrancelha: string;
  titulo: string;
  descricao?: string;
  migalhas?: Migalha[];
}) {
  return (
    <section className="sobre-bordo bg-gradient-to-b from-bordo-800 to-bordo-900 py-12 text-areia-50 lg:py-20">
      <Container>
        {migalhas.length > 0 ? (
          <nav aria-label="Trilha de navegação" className="mb-8">
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] text-areia-200">
              <li className="flex items-center gap-2">
                <Link
                  href="/"
                  className="transition-colors hover:text-dourado-400"
                >
                  Início
                </Link>
                <ChevronRight
                  aria-hidden
                  className="size-3.5 text-dourado-500"
                />
              </li>
              {migalhas.map((migalha, indice) => (
                <li key={migalha.rotulo} className="flex items-center gap-2">
                  {migalha.href ? (
                    <Link
                      href={migalha.href}
                      className="transition-colors hover:text-dourado-400"
                    >
                      {migalha.rotulo}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-areia-50">
                      {migalha.rotulo}
                    </span>
                  )}
                  {indice < migalhas.length - 1 ? (
                    <ChevronRight
                      aria-hidden
                      className="size-3.5 text-dourado-500"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <span className="sobrancelha entra atraso-1 block">{sobrancelha}</span>
        {/* origin-left: o filete se desenha da esquerda, não a partir do meio. */}
        <span
          aria-hidden
          className="filete entra-riscando atraso-2 mt-4 origin-left"
        />
        <h1 className="entra atraso-3 mt-6 max-w-[22ch] text-[2rem] sm:text-[2.5rem] lg:text-[3rem]">
          {titulo}
        </h1>
        {descricao ? (
          <p className="entra atraso-4 mt-6 max-w-[62ch] text-[1.0625rem] text-areia-200">
            {descricao}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
