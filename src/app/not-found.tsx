import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/shared/container";
import { Filete } from "@/components/shared/section-heading";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description:
    "O endereço acessado não existe ou foi alterado. Volte à página inicial ou consulte as áreas de atuação do escritório.",
  robots: { index: false, follow: true },
};

export default function PaginaNaoEncontrada() {
  return (
    <Container className="py-24 lg:py-32">
      <div className="max-w-[46rem]">
        <span className="sobrancelha">Erro 404</span>
        <Filete className="mt-4" />
        <h1 className="mt-6 text-[2rem] sm:text-[2.5rem]">
          Esta página não foi encontrada
        </h1>
        <p className="mt-5 max-w-[60ch] text-grafite-600">
          O endereço acessado não existe ou foi alterado. Você pode voltar à
          página inicial, consultar as áreas de atuação ou falar diretamente com
          o escritório.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="primario">
            <Link href="/">Voltar à página inicial</Link>
          </Button>
          <Button asChild variant="contorno">
            <Link href="/areas-de-atuacao">Ver áreas de atuação</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
