import { MapPin } from "lucide-react";
import Link from "next/link";

import { LinkContato } from "@/components/layout/link-contato";
import { Logo } from "@/components/layout/logo";
import { Container } from "@/components/shared/container";
import { areas } from "@/content/areas";
import { navegacaoPrincipal } from "@/content/navegacao";
import { anosDeAtuacao, site } from "@/content/site";

export function Footer() {
  const ano = new Date().getFullYear();
  const anos = anosDeAtuacao();

  return (
    <footer className="sobre-bordo mt-auto bg-bordo-900 text-areia-50">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-12 lg:gap-8 lg:py-20">
          {/* Assinatura */}
          <div className="lg:col-span-4">
            <Logo />
            <p className="mt-6 max-w-[38ch] text-[0.9375rem] text-areia-200">
              Escritório de advocacia com sede no centro de São Paulo, atuante
              há {anos} anos em dez áreas do direito, com atendimento em todo o
              território nacional.
            </p>

            <address className="mt-6 flex gap-3 text-[0.9375rem] not-italic text-areia-200">
              <MapPin aria-hidden className="mt-1 size-4 shrink-0 text-dourado-500" />
              <span>
                {site.endereco.logradouro}
                <br />
                {site.endereco.bairro} — {site.endereco.cidade}/
                {site.endereco.uf}
                <br />
                CEP {site.endereco.cep}
              </span>
            </address>
          </div>

          {/* Áreas de atuação */}
          <nav aria-labelledby="rodape-areas" className="lg:col-span-4">
            <h2
              id="rodape-areas"
              className="font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-400"
            >
              Áreas de atuação
            </h2>
            <span aria-hidden className="mt-4 block h-px w-8 bg-dourado-500" />
            <ul className="mt-5 grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {areas.map((area) => (
                <li key={area.slug}>
                  <Link
                    href={`/areas-de-atuacao/${area.slug}`}
                    className="text-[0.9375rem] text-areia-200 transition-colors hover:text-dourado-400"
                  >
                    {area.nome}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Navegação e contato */}
          <div className="flex flex-col gap-10 lg:col-span-4">
            <nav aria-labelledby="rodape-navegacao">
              <h2
                id="rodape-navegacao"
                className="font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-400"
              >
                Navegação
              </h2>
              <span aria-hidden className="mt-4 block h-px w-8 bg-dourado-500" />
              <ul className="mt-5 flex flex-col gap-2">
                {navegacaoPrincipal
                  .filter((item) => item.href !== "/")
                  .map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[0.9375rem] text-areia-200 transition-colors hover:text-dourado-400"
                      >
                        {item.rotulo}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>

            <div>
              <h2 className="font-sans text-[0.75rem] font-semibold tracking-[0.14em] uppercase text-dourado-400">
                Contato
              </h2>
              <span aria-hidden className="mt-4 block h-px w-8 bg-dourado-500" />
              <ul className="mt-5 flex flex-col gap-3">
                <li>
                  <LinkContato tipo="whatsapp" origem="rodape" />
                </li>
                <li>
                  <LinkContato tipo="telefone" origem="rodape" />
                </li>
                <li>
                  <LinkContato tipo="email" origem="rodape" />
                </li>
              </ul>
              <p className="mt-5 text-[0.875rem] text-areia-200">
                {site.horario.texto}
              </p>
            </div>
          </div>
        </div>

        {/* Filete dourado de separação */}
        <span aria-hidden className="block h-px bg-dourado-500/45" />

        <div className="flex flex-col gap-6 py-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="text-[0.8125rem] leading-relaxed text-areia-200">
            <p>
              {site.razaoSocial} — CNPJ {site.cnpj}
            </p>
            <p>
              Sociedade de advogados inscrita na {site.oab}
              {site.oabNumero ? ` sob o nº ${site.oabNumero}` : ""}. Escritório
              fundado em {site.fundacao}.
            </p>
            <p className="mt-2">
              © {ano} {site.razaoSocial}. Todos os direitos reservados.
            </p>
          </div>

          <div className="flex flex-col gap-2 text-[0.8125rem] lg:items-end">
            <Link
              href="/politica-de-privacidade"
              className="text-areia-200 underline underline-offset-4 transition-colors hover:text-dourado-400"
            >
              Política de privacidade
            </Link>
            {site.credito.texto ? (
              <p className="text-areia-200/90">
                Comunicação e desenvolvimento: {site.credito.texto}
              </p>
            ) : null}
          </div>
        </div>

        <p className="pb-10 text-[0.75rem] leading-relaxed text-areia-200/90">
          O conteúdo deste site tem caráter exclusivamente informativo, em
          observância ao Código de Ética e Disciplina da OAB e ao Provimento nº
          205/2021 do Conselho Federal da OAB. Não constitui oferta de serviços,
          captação de clientela nem orientação jurídica para casos concretos.
        </p>
      </Container>
    </footer>
  );
}
