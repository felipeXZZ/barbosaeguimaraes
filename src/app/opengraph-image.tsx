import { ImageResponse } from "next/og";

import { anosDeAtuacao, site } from "@/content/site";

export const alt = `${site.nome}: advocacia em São Paulo desde ${site.fundacao}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Imagem de compartilhamento social, gerada em build. */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#4A0E11",
          padding: 72,
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ width: 64, height: 2, backgroundColor: "#C9A227" }} />
          <div
            style={{
              marginTop: 24,
              fontSize: 22,
              letterSpacing: 6,
              color: "#D9BC5C",
              textTransform: "uppercase",
              display: "flex",
            }}
          >
            Advogados Associados
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 76,
              lineHeight: 1.1,
              color: "#FAF8F5",
              letterSpacing: -1,
              display: "flex",
            }}
          >
            Barbosa e Guimarães
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 30,
              color: "#E3DACB",
              maxWidth: 900,
              display: "flex",
            }}
          >
            {`Advocacia técnica e institucional desde ${site.fundacao} · ${anosDeAtuacao()} anos de atuação`}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 22,
            color: "#D9BC5C",
          }}
        >
          <div style={{ display: "flex" }}>
            {`${site.endereco.logradouro}, ${site.endereco.bairro}, São Paulo`}
          </div>
          <div style={{ display: "flex" }}>10 áreas do direito</div>
        </div>
      </div>
    ),
    size,
  );
}
