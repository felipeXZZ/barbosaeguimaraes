import { Container } from "@/components/shared/container";
import { Revelar } from "@/components/shared/revelar";
import { SectionHeading } from "@/components/shared/section-heading";

const passos = [
  {
    numero: "01",
    titulo: "Contato inicial",
    texto:
      "Você descreve a situação por WhatsApp, telefone ou formulário. Nesse primeiro momento só precisamos entender o assunto e a urgência.",
  },
  {
    numero: "02",
    titulo: "Análise preliminar",
    texto:
      "Reunimos os documentos disponíveis e verificamos a matéria envolvida, os prazos aplicáveis e a via adequada: administrativa, extrajudicial ou judicial.",
  },
  {
    numero: "03",
    titulo: "Definição de estratégia",
    texto:
      "Apresentamos os caminhos possíveis, com os riscos e as etapas de cada um. A decisão sobre como prosseguir é sempre do cliente, por escrito.",
  },
  {
    numero: "04",
    titulo: "Acompanhamento",
    texto:
      "O caso passa a ser acompanhado pela controladoria jurídica do escritório, com atualização dos andamentos e canal aberto para dúvidas.",
  },
];

/**
 * Explicar o rito do atendimento reduz a insegurança de quem nunca
 * contratou advogado. É informação sobre o serviço, plenamente permitida.
 */
export function ComoFunciona() {
  return (
    <section
      aria-labelledby="atendimento-titulo"
      className="border-b border-areia-200 py-16 lg:py-24"
    >
      <Container>
        <Revelar>
          <SectionHeading
            sobrancelha="Como funciona o atendimento"
            titulo="Do primeiro contato ao acompanhamento do caso"
            descricao="Um percurso claro, para que você saiba o que esperar em cada etapa."
            id="atendimento-titulo"
          />
        </Revelar>

        <ol className="mt-12 grid gap-px bg-areia-200 sm:grid-cols-2 lg:grid-cols-4">
          {passos.map((passo, indice) => (
            <li key={passo.numero} className="bg-areia-50">
              <Revelar atraso={indice * 0.08} className="h-full">
                <div className="flex h-full flex-col gap-4 p-6 lg:p-8">
                  <span className="font-serif text-[1.75rem] leading-none text-dourado-700">
                    {passo.numero}
                  </span>
                  <span aria-hidden className="h-px w-8 bg-dourado-700" />
                  <h3 className="font-serif text-[1.1875rem] text-bordo-900">
                    {passo.titulo}
                  </h3>
                  <p className="text-[0.9375rem] text-grafite-600">
                    {passo.texto}
                  </p>
                </div>
              </Revelar>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
