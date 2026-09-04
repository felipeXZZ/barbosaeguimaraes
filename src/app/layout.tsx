import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";

import { BotaoWhatsAppFlutuante } from "@/components/layout/botao-whatsapp-flutuante";
import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { LinkPularConteudo } from "@/components/layout/link-pular-conteudo";
import { DadosEstruturados } from "@/components/shared/dados-estruturados";
import { site } from "@/content/site";
import { GTM_ID } from "@/lib/analytics";
import { jsonLdEscritorio } from "@/lib/jsonld";

import "./globals.css";

/* next/font baixa e hospeda as fontes no próprio domínio em tempo de build.
   Nenhuma requisição ao Google Fonts é feita pelo navegador do visitante. */
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.nome} | Advocacia em São Paulo desde ${site.fundacao}`,
    template: `%s | ${site.nomeCurto} Advogados`,
  },
  description: site.descricao,
  applicationName: site.nome,
  authors: [{ name: site.nome }],
  creator: site.nome,
  publisher: site.nome,
  alternates: { canonical: "/" },
  formatDetection: { telephone: true, email: true, address: true },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: site.url,
    siteName: site.nome,
    title: `${site.nome} | Advocacia em São Paulo desde ${site.fundacao}`,
    description: site.descricao,
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.nome} | Advocacia em São Paulo`,
    description: site.descricao,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#4A0E11",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="pt-BR"
      className={`${playfair.variable} ${inter.variable} h-full`}
    >
      <head>
        {/* Sem JavaScript, o conteúdo revelado por animação precisa aparecer. */}
        <noscript>
          <style>{`[data-revelar]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-full flex-col">
        {GTM_ID ? (
          <>
            <Script id="gtm" strategy="afterInteractive">
              {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`}
            </Script>
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
                title="Google Tag Manager"
              />
            </noscript>
          </>
        ) : null}

        <DadosEstruturados dados={jsonLdEscritorio()} />
        <LinkPularConteudo />
        <Header />
        <main id="conteudo" className="flex-1">
          {children}
        </main>
        <Footer />
        <BotaoWhatsAppFlutuante />
      </body>
    </html>
  );
}
