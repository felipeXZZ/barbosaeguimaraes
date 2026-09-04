import type { Metadata } from "next";
import { Clock, MapPin, Train } from "lucide-react";

import { LinkContato } from "@/components/layout/link-contato";
import { CabecalhoPagina } from "@/components/shared/cabecalho-pagina";
import { Container } from "@/components/shared/container";
import { FormularioContato } from "@/components/shared/formulario-contato";
import { MapaLocalizacao } from "@/components/shared/mapa-localizacao";
import { Revelar } from "@/components/shared/revelar";
import { Filete } from "@/components/shared/section-heading";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Fale com o Barbosa e Guimarães Advogados Associados: Praça Dr. João Mendes, 42, Sé, São Paulo. WhatsApp, telefone, e-mail e formulário para envio do seu caso.",
  alternates: { canonical: "/contato" },
};

export default function PaginaContato() {
  return (
    <>
      <CabecalhoPagina
        sobrancelha="Contato"
        titulo="Fale com o escritório"
        descricao="Atendimento presencial no centro de São Paulo e atendimento remoto para clientes de outras localidades. Escolha o canal que preferir."
        migalhas={[{ rotulo: "Contato" }]}
      />

      <section className="py-16 lg:py-24">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            {/* Dados */}
            <Revelar className="lg:col-span-5">
              <span className="sobrancelha">Canais diretos</span>
              <Filete className="mt-4" />
              <h2 className="mt-6 text-[1.75rem] sm:text-[2rem]">
                Onde estamos e como falar
              </h2>

              <ul className="mt-8 flex flex-col gap-5">
                <li>
                  <LinkContato tipo="whatsapp" origem="contato" tema="escuro" />
                </li>
                <li>
                  <LinkContato tipo="telefone" origem="contato" tema="escuro" />
                </li>
                <li>
                  <LinkContato tipo="email" origem="contato" tema="escuro" />
                </li>
              </ul>

              <div className="mt-8 flex flex-col gap-5 border-t border-areia-200 pt-8">
                <div className="flex items-start gap-3">
                  <MapPin
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-dourado-700"
                  />
                  <address className="text-[0.9375rem] text-grafite-900 not-italic">
                    <strong className="font-medium">Endereço</strong>
                    <br />
                    {site.endereco.logradouro}
                    <br />
                    {site.endereco.bairro} — {site.endereco.cidade}/
                    {site.endereco.uf}
                    <br />
                    CEP {site.endereco.cep}
                  </address>
                </div>

                <div className="flex items-start gap-3">
                  <Train
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-dourado-700"
                  />
                  <p className="text-[0.9375rem] text-grafite-600">
                    {site.endereco.referencia}, a poucos minutos das estações Sé
                    e Anhangabaú do metrô.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Clock
                    aria-hidden
                    className="mt-1 size-4 shrink-0 text-dourado-700"
                  />
                  <p className="text-[0.9375rem] text-grafite-600">
                    {site.horario.texto}. O atendimento presencial é feito
                    mediante agendamento prévio.
                  </p>
                </div>
              </div>

              <p className="mt-8 border border-areia-200 bg-areia-100 p-4 text-[0.8125rem] text-grafite-600">
                Para preservar o sigilo profissional, evite enviar documentos ou
                dados sensíveis neste primeiro contato. A forma segura de envio
                é combinada no atendimento.
              </p>
            </Revelar>

            {/* Formulário */}
            <Revelar atraso={0.1} className="lg:col-span-7">
              <div className="border border-areia-200 bg-areia-100 p-6 lg:p-8">
                <h2 className="font-serif text-[1.375rem] text-bordo-900">
                  Envie seu caso
                </h2>
                <p className="mt-2 mb-6 text-[0.9375rem] text-grafite-600">
                  Descreva a situação em linhas gerais. O retorno é feito pelo
                  canal que você indicar.
                </p>
                <FormularioContato origem="pagina_contato" />
              </div>
            </Revelar>
          </div>
        </Container>
      </section>

      {/* Mapa */}
      <section aria-labelledby="mapa-titulo" className="pb-16 lg:pb-24">
        <Container>
          <h2
            id="mapa-titulo"
            className="font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-700"
          >
            Localização
          </h2>
          <span aria-hidden className="mt-4 block h-px w-8 bg-dourado-700" />
          <MapaLocalizacao className="mt-6 aspect-[16/10] w-full sm:aspect-[21/9]" />
        </Container>
      </section>
    </>
  );
}
