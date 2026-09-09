import Link from "next/link";

import { FormularioLogin } from "@/components/admin/formulario-login";
import { supabaseConfigurado } from "@/lib/supabase/config";

export default function PaginaLogin() {
  return (
    <div className="mx-auto max-w-[26rem] py-6">
      <span className="sobrancelha block">Barbosa e Guimarães</span>
      <h1 className="mt-4 font-serif text-[1.75rem] text-bordo-900">
        Painel de artigos
      </h1>
      <p className="mt-3 text-[0.9375rem] text-grafite-600">
        Entre com o e-mail cadastrado para publicar e editar os artigos do
        site.
      </p>

      <div className="mt-8 border border-areia-200 bg-white p-6">
        {supabaseConfigurado ? (
          <FormularioLogin />
        ) : (
          <p className="text-[0.9375rem] text-grafite-600">
            O painel ainda não está conectado ao banco de dados. Configure{" "}
            <code>NEXT_PUBLIC_SUPABASE_URL</code> e{" "}
            <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code> (ou{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>, em projetos antigos do
            Supabase) no ambiente onde o site roda, e rode o arquivo{" "}
            <code>supabase/schema.sql</code> no painel do Supabase. Em
            produção, as variáveis só passam a valer no deploy seguinte.
          </p>
        )}
      </div>

      <Link
        href="/"
        className="mt-8 inline-block text-[0.875rem] text-grafite-600 underline underline-offset-4"
      >
        Voltar ao site
      </Link>
    </div>
  );
}
