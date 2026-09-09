import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { FormularioArtigo } from "@/components/admin/formulario-artigo";
import { buscarArtigoDoPainel } from "@/lib/artigos";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PaginaEditarArtigo({ params }: Props) {
  const { id } = await params;
  const artigo = await buscarArtigoDoPainel(id);

  if (!artigo) notFound();

  return (
    <>
      <Link
        href="/admin"
        className="entra-leve inline-flex items-center gap-2 text-[0.875rem] text-grafite-600 transition-colors hover:text-bordo-700"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Todos os artigos
      </Link>

      <h1 className="entra-leve mt-5 font-serif text-[1.5rem] text-bordo-900 sm:mt-6 sm:text-[1.75rem]">
        Editar artigo
      </h1>
      <p className="mt-2 text-[0.9375rem] text-grafite-600">
        {artigo.published
          ? "Este artigo está publicado no site."
          : "Este artigo é um rascunho e ainda não aparece no site."}
      </p>

      <div className="entra-leve atraso-2 mt-6 sm:mt-10">
        <FormularioArtigo artigo={artigo} />
      </div>
    </>
  );
}
