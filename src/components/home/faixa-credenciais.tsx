import { Building, Landmark, MapPin, Scale } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Container } from "@/components/shared/container";
import { totalAreas } from "@/content/areas";
import { anosDeAtuacao, site } from "@/content/site";

interface Credencial {
  icone: LucideIcon;
  destaque: string;
  rotulo: string;
  detalhe: string;
}

/**
 * Fatos verificáveis. Nenhuma métrica de resultado, valor recuperado ou
 * comparação com outros escritórios, vedado pelo Provimento 205/2021.
 */
export function FaixaCredenciais() {
  const credenciais: Credencial[] = [
    {
      icone: Landmark,
      destaque: String(anosDeAtuacao()),
      rotulo: "anos de atuação",
      detalhe: `Escritório fundado em ${site.fundacao}`,
    },
    {
      icone: Scale,
      destaque: String(totalAreas),
      rotulo: "áreas do direito",
      detalhe: "Do direito penal ao tributário",
    },
    {
      icone: MapPin,
      destaque: "Praça João Mendes",
      rotulo: "centro de São Paulo",
      detalhe: site.endereco.referencia,
    },
    {
      icone: Building,
      destaque: "Brasil",
      rotulo: "atuação nacional",
      detalhe: "Parcerias em todo o território nacional",
    },
  ];

  return (
    <section
      aria-label="Dados institucionais do escritório"
      className="border-b border-areia-200 bg-areia-100"
    >
      <Container>
        <ul className="grid grid-cols-1 divide-y divide-areia-200 sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-4">
          {credenciais.map((item) => (
            <li
              key={item.rotulo}
              className="flex flex-col gap-3 py-8 sm:px-6 sm:py-10 lg:border-l lg:border-areia-200 lg:first:border-l-0 lg:first:pl-0"
            >
              <item.icone aria-hidden className="size-5 text-dourado-700" />
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span
                  className={`font-serif leading-none font-semibold text-bordo-800 ${
                    item.destaque.length > 8 ? "text-[1.375rem]" : "text-[2rem]"
                  }`}
                >
                  {item.destaque}
                </span>
                <span className="text-[0.9375rem] text-grafite-900">
                  {item.rotulo}
                </span>
              </p>
              <p className="text-[0.875rem] text-grafite-600">{item.detalhe}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
