"use client";

import * as React from "react";
import { ExternalLink, MapPin } from "lucide-react";

import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const CONSULTA = encodeURIComponent(
  `${site.endereco.logradouro}, ${site.endereco.bairro}, ${site.endereco.cidade} - ${site.endereco.uf}, ${site.endereco.cep}`,
);

const URL_MAPA = `https://www.google.com/maps?q=${CONSULTA}&hl=pt-BR&z=17&output=embed`;
const URL_EXTERNA = `https://www.google.com/maps/search/?api=1&query=${CONSULTA}`;

/**
 * Mapa carregado só depois do clique do usuário.
 * Carregar o iframe do Google automaticamente enviaria dados do visitante a
 * terceiro sem consentimento — evitamos isso e o banner de cookies junto.
 */
export function MapaLocalizacao({ className }: { className?: string }) {
  const [carregado, setCarregado] = React.useState(false);

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden border border-areia-200 bg-areia-100",
        className,
      )}
    >
      {carregado ? (
        <iframe
          src={URL_MAPA}
          title={`Mapa da localização do escritório: ${site.endereco.logradouro}, ${site.endereco.bairro}, ${site.endereco.cidade}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <div className="textura-placeholder absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
          <MapPin aria-hidden className="size-6 text-dourado-700" />
          <span aria-hidden className="filete" />
          <p className="max-w-[38ch] text-[0.9375rem] text-grafite-900">
            {site.endereco.logradouro} — {site.endereco.bairro},{" "}
            {site.endereco.cidade}/{site.endereco.uf}
          </p>
          <p className="max-w-[42ch] text-[0.8125rem] text-grafite-600">
            {site.endereco.referencia}. O mapa é carregado do Google apenas se
            você clicar abaixo.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCarregado(true)}
              className="inline-flex h-11 items-center rounded-[2px] bg-bordo-700 px-5 text-[0.875rem] font-medium text-white transition-colors hover:bg-bordo-600"
            >
              Carregar o mapa
            </button>
            <a
              href={URL_EXTERNA}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-[0.875rem] font-medium text-bordo-700 underline decoration-dourado-700 underline-offset-4"
            >
              Abrir no Google Maps
              <ExternalLink aria-hidden className="size-3.5" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
