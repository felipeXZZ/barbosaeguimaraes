import type { Metadata } from "next";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

import { sair } from "@/app/actions/artigos";
import { NavAdmin } from "@/components/admin/nav-admin";
import { contarMensagensNaoLidas } from "@/lib/mensagens";
import { ehEditor, usuarioAtual } from "@/lib/supabase/servidor";

export const metadata: Metadata = {
  title: "Painel",
  /* O painel nunca pode ser indexado: nem a listagem, nem os rascunhos. */
  robots: { index: false, follow: false, nocache: true },
};

export default async function LayoutAdmin({
  children,
}: {
  children: React.ReactNode;
}) {
  const usuario = await usuarioAtual();
  /* Conta autenticada não é o mesmo que conta autorizada: quem publica
     precisa estar na tabela `editores`. Sem isso o painel só explicaria o
     problema com um erro do banco na hora de salvar. */
  const autorizado = usuario ? await ehEditor() : false;
  /* Aviso no menu. Quem não é editor não lê a tabela, e a contagem devolve
     zero em vez de estourar. */
  const naoLidas = autorizado ? await contarMensagensNaoLidas() : 0;

  return (
    <div className="min-h-full bg-areia-50">
      {usuario ? (
        <header className="entra-leve border-b border-areia-200 bg-white">
          <div className="mx-auto flex max-w-[72rem] flex-wrap items-center gap-x-4 gap-y-2 px-4 py-3 sm:gap-x-6 sm:gap-y-3 sm:px-5 sm:py-4 lg:px-8">
            <Link
              href="/admin"
              className="font-serif text-[1.0625rem] text-bordo-900"
            >
              Painel
            </Link>

            <span aria-hidden className="h-4 w-px bg-areia-200" />

            {autorizado ? <NavAdmin naoLidas={naoLidas} /> : null}

            <span aria-hidden className="h-4 w-px bg-areia-200" />

            <Link
              href="/artigos"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-[0.875rem] text-grafite-600 transition-colors hover:text-bordo-700"
            >
              Ver o site
              <ExternalLink aria-hidden className="size-3.5" />
            </Link>

            <div className="ml-auto flex items-center gap-4">
              <span className="hidden text-[0.8125rem] text-grafite-600 sm:inline">
                {usuario.email}
              </span>
              <form action={sair}>
                <button
                  type="submit"
                  className="text-[0.875rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4"
                >
                  Sair
                </button>
              </form>
            </div>
          </div>
        </header>
      ) : null}

      <div className="mx-auto max-w-[72rem] px-4 py-6 sm:px-5 sm:py-10 lg:px-8 lg:py-14">
        {usuario && !autorizado ? (
          <div className="mx-auto max-w-[38rem] border border-areia-200 bg-white p-6 sm:p-8">
            <h1 className="font-serif text-[1.5rem] text-bordo-900">
              Conta sem permissão para publicar
            </h1>
            <p className="mt-4 text-[0.9375rem] text-grafite-600">
              Você entrou como <strong>{usuario.email}</strong>, mas esta conta
              ainda não foi autorizada a editar os artigos.
            </p>
            <p className="mt-3 text-[0.9375rem] text-grafite-600">
              Quem administra o site precisa liberar o acesso rodando a
              instrução do passo 6 do arquivo{" "}
              <code>supabase/schema.sql</code>.
            </p>
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
