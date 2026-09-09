import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { FormularioArtigo } from "@/components/admin/formulario-artigo";

export const dynamic = "force-dynamic";

export default function PaginaNovoArtigo() {
  return (
    <>
      <Link
        href="/admin"
        className="inline-flex items-center gap-2 text-[0.875rem] text-grafite-600 transition-colors hover:text-bordo-700"
      >
        <ArrowLeft aria-hidden className="size-3.5" />
        Todos os artigos
      </Link>

      <h1 className="mt-6 font-serif text-[1.75rem] text-bordo-900">
        Novo artigo
      </h1>
      <p className="mt-2 max-w-[62ch] text-[0.9375rem] text-grafite-600">
        Salve como rascunho quantas vezes quiser: o texto só aparece no site
        depois de publicado.
      </p>

      <div className="mt-10">
        <FormularioArtigo />
      </div>
    </>
  );
}
