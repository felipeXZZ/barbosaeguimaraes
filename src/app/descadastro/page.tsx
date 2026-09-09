import type { Metadata } from "next";
import Link from "next/link";

import { ConfirmarSaida } from "@/components/shared/confirmar-saida";
import { Container } from "@/components/shared/container";
import { FileteRevelado } from "@/components/shared/revelar";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Sair da lista de divulgação",
  description:
    "Cancele o recebimento das matérias publicadas pelo escritório Barbosa e Guimarães.",
  robots: { index: false, follow: false },
};

interface Props {
  searchParams: Promise<{ t?: string }>;
}

export default async function PaginaDescadastro({ searchParams }: Props) {
  const { t } = await searchParams;
  const token = (t ?? "").trim();

  return (
    <Container className="py-24 lg:py-32">
      <div className="max-w-[46rem]">
        <span className="sobrancelha">Lista de divulgação</span>
        <FileteRevelado className="mt-4" />
        <h1 className="mt-6 text-[2rem] sm:text-[2.5rem]">
          Sair da lista de divulgação
        </h1>

        {token ? (
          <>
            <p className="mt-5 max-w-[60ch] text-grafite-600">
              Ao confirmar, seu endereço deixa de receber os e-mails com as
              matérias publicadas pelo escritório. Isso não afeta nenhum
              atendimento em andamento nem qualquer contato que você tenha
              feito pelo site.
            </p>
            <ConfirmarSaida token={token} />
          </>
        ) : (
          <p className="mt-5 max-w-[60ch] text-grafite-600">
            Este endereço precisa ser aberto pelo link que está no rodapé do
            e-mail que você recebeu. Se preferir, escreva para{" "}
            <a
              href={`mailto:${site.contato.email}`}
              className="text-bordo-700 underline decoration-dourado-700 underline-offset-4"
            >
              {site.contato.email}
            </a>{" "}
            pedindo a exclusão, e o escritório faz a retirada.
          </p>
        )}

        <p className="mt-10 text-[0.9375rem] text-grafite-600">
          <Link href="/" className="underline underline-offset-4">
            Voltar ao site
          </Link>
        </p>
      </div>
    </Container>
  );
}
