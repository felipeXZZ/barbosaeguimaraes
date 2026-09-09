import Link from "next/link";

import { AvisoTabela } from "@/components/admin/aviso-tabela";
import { ListaMensagens } from "@/components/admin/lista-mensagens";
import { listarMensagens, nomeDaArea } from "@/lib/mensagens";
import { cn } from "@/lib/utils";

/* A listagem depende da sessão em cookie: nunca pode ser servida de cache. */
export const dynamic = "force-dynamic";

const FILTROS = [
  { chave: "todas", rotulo: "Todas" },
  { chave: "nao-lidas", rotulo: "Não lidas" },
] as const;

type ChaveFiltro = (typeof FILTROS)[number]["chave"];

interface Props {
  searchParams: Promise<{ filtro?: string }>;
}

function Cabecalho({ descricao }: { descricao: string }) {
  return (
    <header className="entra-leve">
      <span className="sobrancelha block">Contatos do site</span>
      <h1 className="mt-3 font-serif text-[1.875rem] text-bordo-900">
        Mensagens
      </h1>
      <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-grafite-600">
        {descricao}
      </p>
    </header>
  );
}

export default async function PaginaMensagens({ searchParams }: Props) {
  const { filtro } = await searchParams;
  const ativo: ChaveFiltro = FILTROS.some((f) => f.chave === filtro)
    ? (filtro as ChaveFiltro)
    : "todas";

  const mensagens = await listarMensagens();

  if (mensagens === null) {
    return (
      <>
        <Cabecalho descricao="Tudo que chega pelo formulário de contato fica registrado aqui." />
        <AvisoTabela o_que="a tabela de mensagens" />
      </>
    );
  }

  const naoLidas = mensagens.filter((mensagem) => !mensagem.lida).length;

  const contagem: Record<ChaveFiltro, number> = {
    todas: mensagens.length,
    "nao-lidas": naoLidas,
  };

  const visiveis = (
    ativo === "nao-lidas"
      ? mensagens.filter((mensagem) => !mensagem.lida)
      : mensagens
  ).map((mensagem) => ({ ...mensagem, areaNome: nomeDaArea(mensagem.area) }));

  return (
    <>
      <Cabecalho
        descricao={
          mensagens.length === 0
            ? "Nenhuma mensagem recebida ainda."
            : `${mensagens.length} ${mensagens.length === 1 ? "mensagem" : "mensagens"} · ${naoLidas} ${naoLidas === 1 ? "não lida" : "não lidas"}. O e-mail continua chegando na caixa do escritório.`
        }
      />

      {mensagens.length === 0 ? (
        <div className="entra-leve atraso-1 mt-8 border border-areia-200 bg-white p-6 sm:mt-10 sm:p-8">
          <h2 className="font-serif text-[1.25rem] text-bordo-900">
            A caixa está vazia
          </h2>
          <p className="mt-3 max-w-[60ch] text-[0.9375rem] text-grafite-600">
            A partir de agora, cada mensagem enviada pelo formulário do site
            aparece nesta tela, além de continuar chegando por e-mail. As
            mensagens recebidas antes desta mudança estão só na caixa de
            e-mail.
          </p>
        </div>
      ) : (
        <>
          <nav
            aria-label="Filtrar mensagens"
            className="entra-leve atraso-1 mt-8 flex items-center gap-1 overflow-x-auto border-b border-areia-200 sm:mt-10 sm:flex-wrap sm:overflow-x-visible"
          >
            {FILTROS.map((item) => {
              const selecionado = item.chave === ativo;
              return (
                <Link
                  key={item.chave}
                  href={
                    item.chave === "todas"
                      ? "/admin/mensagens"
                      : `/admin/mensagens?filtro=${item.chave}`
                  }
                  aria-current={selecionado ? "page" : undefined}
                  className={cn(
                    "-mb-px inline-flex shrink-0 items-center gap-2 border-b-2 px-3 py-3 text-[0.9375rem] font-medium whitespace-nowrap transition-colors sm:px-4",
                    selecionado
                      ? "border-bordo-700 text-bordo-900"
                      : "border-transparent text-grafite-600 hover:text-bordo-700",
                  )}
                >
                  {item.rotulo}
                  <span
                    className={cn(
                      "inline-flex min-w-6 items-center justify-center rounded-[2px] px-1.5 py-0.5 text-[0.75rem]",
                      selecionado
                        ? "bg-bordo-700 text-white"
                        : "bg-areia-100 text-grafite-600",
                    )}
                  >
                    {contagem[item.chave]}
                  </span>
                </Link>
              );
            })}
          </nav>

          {visiveis.length === 0 ? (
            <p className="mt-8 border border-areia-200 bg-white p-6 text-[0.9375rem] text-grafite-600 sm:mt-10 sm:p-8">
              Nenhuma mensagem não lida: tudo que chegou já foi visto.
            </p>
          ) : (
            <ListaMensagens mensagens={visiveis} />
          )}
        </>
      )}
    </>
  );
}
