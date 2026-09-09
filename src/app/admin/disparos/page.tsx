import { AlertCircle } from "lucide-react";

import { AvisoTabela } from "@/components/admin/aviso-tabela";
import {
  ExcluirDisparo,
  EnviarDisparo,
  NovoDisparo,
  type ArtigoParaDisparo,
} from "@/components/admin/painel-disparo";
import { listarArtigosDoPainel } from "@/lib/artigos";
import { listarDisparos } from "@/lib/disparos";
import { listarMailing } from "@/lib/mailing";
import { envioConfigurado } from "@/lib/mail";
import { cn } from "@/lib/utils";

/* Depende da sessão em cookie: nunca pode ser servida de cache. */
export const dynamic = "force-dynamic";

function numero(valor: number): string {
  return valor.toLocaleString("pt-BR");
}

function quando(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "America/Sao_Paulo",
  });
}

function Cabecalho() {
  return (
    <header className="entra-leve">
      <span className="sobrancelha block">Divulgação das matérias</span>
      <h1 className="mt-3 font-serif text-[1.875rem] text-bordo-900">
        Disparos
      </h1>
      <p className="mt-2 max-w-[68ch] text-[0.9375rem] text-grafite-600">
        Envia uma matéria publicada para a lista de contatos, com link de saída
        no rodapé de cada e-mail.
      </p>
    </header>
  );
}

export default async function PaginaDisparos() {
  const disparos = await listarDisparos();

  if (disparos === null) {
    return (
      <>
        <Cabecalho />
        <AvisoTabela o_que="as tabelas de disparo" />
      </>
    );
  }

  const [artigos, mailing] = await Promise.all([
    listarArtigosDoPainel(),
    listarMailing("", 1),
  ]);

  const publicados: ArtigoParaDisparo[] = artigos
    .filter((artigo) => artigo.published)
    .map((artigo) => ({ id: artigo.id, titulo: artigo.title }));

  const ativos = mailing?.ativos ?? 0;

  return (
    <>
      <Cabecalho />

      {!envioConfigurado ? (
        <div className="entra-leve atraso-1 mt-6 flex items-start gap-3 border border-erro/40 bg-erro/5 p-4 text-[0.9375rem] text-erro sm:mt-8">
          <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0" />
          <span>
            O envio de e-mail ainda não está configurado. Defina{" "}
            <code>RESEND_API_KEY</code> e{" "}
            <code>CONTATO_EMAIL_REMETENTE</code> (endereço de domínio
            verificado no Resend) no ambiente do site. Sem isso, dá para
            preparar o disparo, mas nada sai.
          </span>
        </div>
      ) : null}

      <div className="entra-leve atraso-1 mt-6 sm:mt-8">
        <NovoDisparo artigos={publicados} ativos={ativos} />
      </div>

      {disparos.length > 0 ? (
        <section className="entra-leve atraso-2 mt-10">
          <h2 className="border-b border-areia-200 pb-4 font-serif text-[1.25rem] text-bordo-900">
            Disparos anteriores
          </h2>

          <ul className="entra-lista mt-6 flex flex-col gap-3">
            {disparos.map((disparo) => (
              <li
                key={disparo.id}
                className="border border-areia-200 bg-white p-3 sm:p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                  <div className="min-w-0 flex-1 sm:min-w-[16rem]">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.75rem] text-grafite-600">
                      <span
                        className={cn(
                          "rounded-[2px] px-1.5 py-0.5 text-[0.6875rem] font-medium",
                          disparo.pendentes === 0
                            ? "bg-areia-100 text-grafite-600"
                            : "bg-bordo-700/10 text-bordo-700",
                        )}
                      >
                        {disparo.pendentes === 0
                          ? "Concluído"
                          : `${numero(disparo.pendentes)} na fila`}
                      </span>
                      <time dateTime={disparo.criadoEm}>
                        {quando(disparo.criadoEm)}
                      </time>
                      {disparo.criadoPor ? (
                        <>
                          <span aria-hidden className="h-3 w-px bg-areia-200" />
                          <span>{disparo.criadoPor}</span>
                        </>
                      ) : null}
                    </div>

                    <h3 className="mt-1.5 font-serif text-[1.0625rem] text-bordo-900">
                      {disparo.assunto}
                    </h3>
                    <p className="mt-1 text-[0.875rem] text-grafite-600">
                      {disparo.artigoTitulo} · {numero(disparo.enviados)} de{" "}
                      {numero(disparo.total)} enviados
                    </p>
                  </div>

                  <ExcluirDisparo id={disparo.id} assunto={disparo.assunto} />
                </div>

                <div className="mt-3 border-t border-areia-200 pt-3">
                  <EnviarDisparo
                    id={disparo.id}
                    assunto={disparo.assunto}
                    total={disparo.total}
                    enviados={disparo.enviados}
                    pendentes={disparo.pendentes}
                    compacto
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
