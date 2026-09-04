import { Clock, MapPin } from "lucide-react";

import { LinkContato } from "@/components/layout/link-contato";
import { Container } from "@/components/shared/container";
import { CtaWhatsApp } from "@/components/shared/cta-whatsapp";
import { FormularioContato } from "@/components/shared/formulario-contato";
import { Revelar } from "@/components/shared/revelar";
import { Filete } from "@/components/shared/section-heading";
import { site } from "@/content/site";

export function ContatoFinal() {
  return (
    <section
      aria-labelledby="contato-titulo"
      className="sobre-bordo bg-bordo-900 py-16 text-areia-50 lg:py-24"
    >
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Revelar className="lg:col-span-5">
            <span className="sobrancelha">Contato</span>
            <Filete className="mt-4" />
            <h2
              id="contato-titulo"
              className="mt-6 text-[1.75rem] sm:text-[2.125rem]"
            >
              Fale com o escritório
            </h2>
            <p className="mt-5 max-w-[46ch] text-areia-200">
              Atendimento presencial na Praça João Mendes, no centro de São
              Paulo, e atendimento remoto para clientes de outras localidades.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              <li>
                <LinkContato tipo="whatsapp" origem="contato_home" />
              </li>
              <li>
                <LinkContato tipo="telefone" origem="contato_home" />
              </li>
              <li>
                <LinkContato tipo="email" origem="contato_home" />
              </li>
              <li className="flex items-start gap-3 text-[0.9375rem] text-areia-200">
                <MapPin
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-dourado-500"
                />
                <address className="not-italic">
                  {site.endereco.logradouro} — {site.endereco.bairro}
                  <br />
                  {site.endereco.cidade}/{site.endereco.uf}, CEP{" "}
                  {site.endereco.cep}
                </address>
              </li>
              <li className="flex items-start gap-3 text-[0.9375rem] text-areia-200">
                <Clock
                  aria-hidden
                  className="mt-1 size-4 shrink-0 text-dourado-500"
                />
                {site.horario.texto}
              </li>
            </ul>

            <div className="mt-8">
              <CtaWhatsApp origem="contato_home" variant="claro" />
            </div>
          </Revelar>

          <Revelar atraso={0.1} className="lg:col-span-7">
            <div className="border border-areia-50/20 p-6 lg:p-8">
              <h3 className="font-serif text-[1.25rem]">
                Envie uma mensagem ao escritório
              </h3>
              <p className="mt-2 mb-6 text-[0.9375rem] text-areia-200">
                Responderemos pelo canal que você indicar.
              </p>
              <FormularioContato
                variante="completo"
                tema="escuro"
                origem="home"
              />
            </div>
          </Revelar>
        </div>
      </Container>
    </section>
  );
}
