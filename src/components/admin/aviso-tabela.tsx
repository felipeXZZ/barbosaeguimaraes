/**
 * Aviso mostrado quando a tabela ainda não existe no Supabase. Sem isso o
 * painel mostraria uma lista vazia, como se nada tivesse chegado.
 */
export function AvisoTabela({ o_que }: { o_que: string }) {
  return (
    <div className="mt-8 border border-areia-200 bg-white p-6 sm:mt-10 sm:p-8">
      <h2 className="font-serif text-[1.25rem] text-bordo-900">
        Falta criar {o_que} no banco
      </h2>
      <p className="mt-3 max-w-[62ch] text-[0.9375rem] text-grafite-600">
        No painel do Supabase, abra <strong>SQL Editor</strong> →{" "}
        <strong>New query</strong>, cole o conteúdo do arquivo{" "}
        <code className="rounded-[2px] bg-areia-100 px-1.5 py-0.5 text-[0.875rem]">
          supabase/mensagens-e-mailing.sql
        </code>{" "}
        deste projeto e clique em <strong>Run</strong>. É uma vez só; depois
        esta tela passa a funcionar.
      </p>
    </div>
  );
}
