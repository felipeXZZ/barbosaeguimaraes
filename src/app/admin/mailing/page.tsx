import { Download, Search } from "lucide-react";
import Link from "next/link";

import { AvisoTabela } from "@/components/admin/aviso-tabela";
import { LinhaMailing } from "@/components/admin/linha-mailing";
import { AdicionarContatos } from "@/components/admin/mailing-formularios";
import { listarMailing, POR_PAGINA } from "@/lib/mailing";
import { cn } from "@/lib/utils";

/* A listagem depende da sessão em cookie: nunca pode ser servida de cache. */
export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ q?: string; p?: string }>;
}

function numero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function Cabecalho({ enxuto = false }: { enxuto?: boolean }) {
  return (
    <header className="entra-leve">
      <span className="sobrancelha block">Divulgação das matérias</span>
      <h1 className="mt-3 font-serif text-[1.875rem] text-bordo-900">
        Lista de contatos
      </h1>
      {enxuto ? null : (
        <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-grafite-600">
          Os nomes e e-mails para quem o escritório divulga as matérias
          publicadas.
        </p>
      )}
    </header>
  );
}

export default async function PaginaMailing({ searchParams }: Props) {
  const parametros = await searchParams;
  const busca = (parametros.q ?? "").slice(0, 120);
  const pagina = Math.max(1, Number(parametros.p) || 1);

  const dados = await listarMailing(busca, pagina);

  if (dados === null) {
    return (
      <>
        <Cabecalho />
        <AvisoTabela o_que="a tabela da lista de divulgação" />
      </>
    );
  }

  const { contatos, total, totalGeral, ativos } = dados;
  /* Buscando, a tela mostra só o resultado: os números e o painel de incluir
     falam da lista inteira e atrapalhariam a leitura. */
  const pesquisando = busca.trim().length > 0;
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  function endereco(p: number): string {
    const query = new URLSearchParams();
    if (busca) query.set("q", busca);
    if (p > 1) query.set("p", String(p));
    const texto = query.toString();
    return texto ? `/admin/mailing?${texto}` : "/admin/mailing";
  }

  const numeros = (
    <dl className="entra-leve atraso-1 mt-6 grid grid-cols-3 border border-areia-200 bg-white sm:mt-8">
      {[
        { rotulo: "Na lista", valor: totalGeral },
        { rotulo: "Recebendo", valor: ativos },
        { rotulo: "Fora dos envios", valor: totalGeral - ativos },
      ].map((item, i) => (
        <div
          key={item.rotulo}
          className={
            i === 0
              ? "px-3 py-4 sm:px-6"
              : "border-l border-areia-200 px-3 py-4 sm:px-6"
          }
        >
          <dt className="text-[0.75rem] font-semibold tracking-[0.12em] text-grafite-600 uppercase">
            {item.rotulo}
          </dt>
          <dd className="mt-1 font-serif text-[1.5rem] text-bordo-900">
            {numero(item.valor)}
          </dd>
        </div>
      ))}
    </dl>
  );

  const baixarCsv =
    totalGeral > 0 ? (
      <a
        href="/admin/mailing/exportar"
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[2px] border border-areia-200 px-5 text-[0.9375rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700 sm:w-auto"
      >
        <Download aria-hidden className="size-4" />
        Baixar em CSV
      </a>
    ) : null;

  const lista =
    totalGeral > 0 ? (
      <section
        className={cn("entra-leve atraso-2", pesquisando ? "mt-8" : "mt-10")}
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-areia-200 pb-4">
          <h2 className="font-serif text-[1.25rem] text-bordo-900">
            {pesquisando ? "Resultados da busca" : "Quem está na lista"}
          </h2>

          <form
            action="/admin/mailing"
            className="flex w-full items-center gap-2 sm:w-auto"
          >
            <label htmlFor="q" className="sr-only">
              Buscar por nome, e-mail, cidade ou origem
            </label>
            <div className="relative flex-1 sm:w-72 sm:flex-none">
              <Search
                aria-hidden
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-grafite-600"
              />
              <input
                id="q"
                name="q"
                type="search"
                defaultValue={busca}
                placeholder="Nome, e-mail, cidade, OAB"
                className="block h-12 w-full rounded-[2px] border border-grafite-400 bg-white pr-3 pl-9 text-[1rem] text-grafite-900 outline-none transition-colors placeholder:text-grafite-600/60 focus:border-bordo-700 focus:ring-2 focus:ring-bordo-700/15 sm:text-[0.9375rem]"
              />
            </div>
            <button
              type="submit"
              className="inline-flex h-12 items-center rounded-[2px] border border-areia-200 px-4 text-[0.9375rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700"
            >
              Buscar
            </button>
          </form>
        </div>

        {pesquisando ? (
          <p className="mt-4 text-[0.875rem] text-grafite-600">
            {numero(total)} {total === 1 ? "resultado" : "resultados"} para{" "}
            <strong>{busca}</strong> ·{" "}
            <Link
              href="/admin/mailing"
              className="text-bordo-700 underline decoration-dourado-700 underline-offset-4"
            >
              limpar busca
            </Link>
          </p>
        ) : null}

        {contatos.length === 0 ? (
          <p className="mt-6 border border-areia-200 bg-white p-6 text-[0.9375rem] text-grafite-600">
            Nenhum contato encontrado.
          </p>
        ) : (
          <ul className="entra-lista mt-6 flex flex-col gap-3">
            {contatos.map((contato) => (
              <LinhaMailing key={contato.id} contato={contato} />
            ))}
          </ul>
        )}

        {paginas > 1 ? (
          <nav
            aria-label="Páginas da lista"
            className="mt-6 flex items-center justify-between gap-4"
          >
            {pagina > 1 ? (
              <Link
                href={endereco(pagina - 1)}
                className="inline-flex h-10 items-center rounded-[2px] border border-areia-200 px-4 text-[0.875rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700"
              >
                Anteriores
              </Link>
            ) : (
              <span />
            )}

            <span className="text-[0.875rem] text-grafite-600">
              Página {numero(pagina)} de {numero(paginas)}
            </span>

            {pagina < paginas ? (
              <Link
                href={endereco(pagina + 1)}
                className="inline-flex h-10 items-center rounded-[2px] border border-areia-200 px-4 text-[0.875rem] font-medium text-grafite-900 transition-colors hover:border-bordo-700 hover:text-bordo-700"
              >
                Próximos
              </Link>
            ) : (
              <span />
            )}
          </nav>
        ) : null}
      </section>
    ) : null;

  return (
    <>
      <Cabecalho enxuto={pesquisando} />

      {pesquisando ? (
        lista
      ) : (
        <AdicionarContatos
          vazia={totalGeral === 0}
          resumo={numeros}
          acoes={baixarCsv}
          lista={lista}
        />
      )}
    </>
  );
}
