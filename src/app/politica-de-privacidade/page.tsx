import type { Metadata } from "next";

import { LinkContato } from "@/components/layout/link-contato";
import { CabecalhoPagina } from "@/components/shared/cabecalho-pagina";
import { Container } from "@/components/shared/container";
import { enderecoLinhaUnica, site } from "@/content/site";
import { analyticsAtivo } from "@/lib/analytics";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description:
    "Como o Barbosa e Guimarães Advogados Associados trata os dados pessoais coletados no site: finalidade, base legal, prazo de retenção, direitos do titular e canal do controlador.",
  alternates: { canonical: "/politica-de-privacidade" },
};

const ATUALIZACAO = "2026-01-15";

function Secao({
  numero,
  titulo,
  children,
}: {
  numero: string;
  titulo: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t border-areia-200 pt-8">
      <h2 className="flex items-baseline gap-3 text-[1.25rem] text-bordo-900 sm:text-[1.375rem]">
        <span className="font-sans text-[0.875rem] font-semibold text-dourado-700">
          {numero}
        </span>
        {titulo}
      </h2>
      <div className="flex flex-col gap-4 text-grafite-600">{children}</div>
    </section>
  );
}

export default function PaginaPolitica() {
  return (
    <>
      <CabecalhoPagina
        sobrancelha="LGPD"
        titulo="Política de privacidade"
        descricao="Esta política explica como o escritório trata os dados pessoais coletados neste site, nos termos da Lei nº 13.709/2018."
        migalhas={[{ rotulo: "Política de privacidade" }]}
      />

      <Container estreito className="py-16 lg:py-24">
        <p className="text-[0.875rem] text-grafite-600">
          Última atualização:{" "}
          {new Date(ATUALIZACAO).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}
        </p>

        <div className="mt-10 flex flex-col gap-10">
          <Secao numero="01" titulo="Quem é o controlador dos dados">
            <p>
              O controlador dos dados pessoais tratados neste site é{" "}
              {site.razaoSocial}, inscrito no CNPJ sob o nº {site.cnpj}, com
              sede em {enderecoLinhaUnica}.
            </p>
            <p>
              O contato para assuntos relacionados à proteção de dados é o
              e-mail {site.contato.email}.
            </p>
          </Secao>

          <Secao numero="02" titulo="Quais dados são coletados">
            <p>
              O site coleta apenas os dados que você informa espontaneamente no
              formulário de contato:
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "nome completo;",
                "endereço de e-mail;",
                "número de telefone;",
                "área do direito de interesse;",
                "o conteúdo da mensagem que você redigir.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 before:mt-[0.85em] before:h-px before:w-3 before:shrink-0 before:bg-dourado-700 before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Não são coletados dados sensíveis por meio do site, e pedimos
              expressamente que documentos e informações sigilosas não sejam
              enviados neste primeiro contato. O envio seguro é combinado
              diretamente com o profissional responsável.
            </p>
            <p>
              O site não utiliza cookies de publicidade nem de perfilamento.{" "}
              {analyticsAtivo
                ? "Há ferramenta de medição de audiência ativa, cujos cookies são informados no aviso exibido no primeiro acesso."
                : "Nenhuma ferramenta de analytics está ativa no momento, razão pela qual não há banner de cookies."}
            </p>
          </Secao>

          <Secao numero="03" titulo="Para que os dados são usados">
            <p>
              Os dados informados são utilizados exclusivamente para responder
              ao contato, avaliar preliminarmente a matéria apresentada e, se
              houver contratação, viabilizar a prestação dos serviços
              advocatícios.
            </p>
            <p>
              Os dados não são vendidos, cedidos, alugados ou compartilhados
              para finalidade publicitária, nem utilizados para envio de
              comunicações de marketing.
            </p>
          </Secao>

          <Secao numero="04" titulo="Base legal do tratamento">
            <p>
              O tratamento se apoia no consentimento do titular, manifestado no
              momento do envio do formulário (art. 7º, I, da LGPD), e, quando
              houver relação contratual, na execução de contrato ou de
              procedimentos preliminares a ele (art. 7º, V).
            </p>
            <p>
              Havendo processo judicial ou administrativo, o tratamento também
              se apoia no exercício regular de direitos (art. 7º, VI) e no
              cumprimento de obrigação legal ou regulatória (art. 7º, II).
            </p>
          </Secao>

          <Secao numero="05" titulo="Sigilo profissional">
            <p>
              Independentemente da LGPD, todas as informações confiadas ao
              escritório estão protegidas pelo sigilo profissional do advogado,
              previsto no artigo 34, inciso VII, da Lei nº 8.906/1994 (o
              Estatuto da Advocacia e da OAB) e no Código de Ética e Disciplina
              da profissão.
            </p>
            <p>
              O dever de sigilo é inerente à advocacia, permanece após o
              encerramento do atendimento e alcança inclusive as consultas que
              não resultem em contratação.
            </p>
          </Secao>

          <Secao numero="06" titulo="Por quanto tempo os dados são mantidos">
            <p>
              Mensagens que não resultem em contratação são mantidas pelo prazo
              de 12 meses, contados do último contato, e então eliminadas.
            </p>
            <p>
              Havendo contratação, os dados são mantidos durante a vigência da
              relação e, após o seu término, pelo prazo necessário ao
              cumprimento de obrigações legais e à defesa de direitos, incluindo
              os prazos prescricionais aplicáveis.
            </p>
          </Secao>

          <Secao numero="07" titulo="Com quem os dados podem ser compartilhados">
            <p>
              O escritório utiliza serviço de terceiro para transmissão dos
              e-mails gerados pelo formulário, que atua como operador e trata os
              dados apenas conforme instrução do controlador.
            </p>
            <p>
              O compartilhamento com terceiros fora dessa hipótese só ocorre por
              determinação legal, ordem judicial ou requisição de autoridade
              competente, e nos estritos limites da requisição, resguardado o
              sigilo profissional.
            </p>
          </Secao>

          <Secao numero="08" titulo="Direitos do titular">
            <p>
              Nos termos do artigo 18 da LGPD, você pode solicitar a qualquer
              momento:
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "confirmação da existência de tratamento;",
                "acesso aos dados;",
                "correção de dados incompletos, inexatos ou desatualizados;",
                "anonimização, bloqueio ou eliminação de dados desnecessários ou tratados em desconformidade com a lei;",
                "portabilidade dos dados a outro fornecedor de serviço;",
                "eliminação dos dados tratados com base no consentimento;",
                "informação sobre o compartilhamento com terceiros;",
                "revogação do consentimento.",
              ].map((item) => (
                <li
                  key={item}
                  className="flex gap-3 before:mt-[0.85em] before:h-px before:w-3 before:shrink-0 before:bg-dourado-700 before:content-['']"
                >
                  {item}
                </li>
              ))}
            </ul>
            <p>
              Os pedidos devem ser enviados para {site.contato.email} e são
              respondidos em até 15 dias. A eliminação pode ser parcialmente
              limitada quando houver obrigação legal de guarda ou necessidade de
              defesa de direitos em processo.
            </p>
          </Secao>

          <Secao numero="09" titulo="Segurança da informação">
            <p>
              O escritório adota medidas técnicas e administrativas para
              proteger os dados pessoais de acessos não autorizados e de
              situações acidentais ou ilícitas de destruição, perda, alteração
              ou difusão, incluindo transmissão criptografada do formulário e
              controle de acesso às caixas de correio institucionais.
            </p>
          </Secao>

          <Secao numero="10" titulo="Alterações desta política">
            <p>
              Esta política pode ser atualizada para refletir mudanças legais ou
              operacionais. A data da última atualização é sempre informada no
              início da página.
            </p>
          </Secao>

          <Secao numero="11" titulo="Fale com o controlador">
            <p>
              Para exercer seus direitos ou esclarecer dúvidas sobre esta
              política, utilize os canais abaixo:
            </p>
            <ul className="flex flex-col gap-3">
              <li>
                <LinkContato tipo="email" origem="politica" tema="escuro" />
              </li>
              <li>
                <LinkContato tipo="telefone" origem="politica" tema="escuro" />
              </li>
            </ul>
          </Secao>
        </div>
      </Container>
    </>
  );
}
