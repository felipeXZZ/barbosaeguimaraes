import { areas } from "@/content/areas";
import { equipe } from "@/content/equipe";
import { site } from "@/content/site";
import type { Artigo, MembroEquipe } from "@/types/content";

const ID_ESCRITORIO = `${site.url}/#escritorio`;

const enderecoSchema = {
  "@type": "PostalAddress",
  streetAddress: site.endereco.logradouro,
  addressLocality: site.endereco.cidade,
  addressRegion: site.endereco.uf,
  postalCode: site.endereco.cep,
  addressCountry: site.endereco.pais,
};

/** LegalService do escritório, vai no layout raiz. */
export function jsonLdEscritorio() {
  return {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": ID_ESCRITORIO,
    name: site.nome,
    legalName: site.razaoSocial,
    description: site.descricao,
    url: site.url,
    telephone: site.contato.telefoneE164,
    email: site.contato.email,
    foundingDate: String(site.fundacao),
    taxID: site.cnpj,
    priceRange: undefined,
    address: enderecoSchema,
    geo: {
      "@type": "GeoCoordinates",
      latitude: site.endereco.geo.lat,
      longitude: site.endereco.geo.lng,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.horario.dias,
        opens: site.horario.abre,
        closes: site.horario.fecha,
      },
    ],
    areaServed: [
      { "@type": "Country", name: "Brasil" },
      { "@type": "City", name: "São Paulo" },
    ],
    knowsLanguage: ["pt-BR"],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Áreas de atuação",
      itemListElement: areas.map((area) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: area.nome,
          description: area.resumoCurto,
          url: `${site.url}/areas-de-atuacao/${area.slug}`,
        },
      })),
    },
    employee: equipe.map((membro) => ({
      "@type": "Person",
      name: membro.nome,
      jobTitle: membro.cargo,
    })),
  };
}

/** Person para cada membro da equipe. */
export function jsonLdPessoa(membro: MembroEquipe) {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: membro.nome,
    jobTitle: membro.cargo,
    description: membro.credenciais.join(". "),
    worksFor: { "@id": ID_ESCRITORIO },
    address: enderecoSchema,
  };
}

/** Article de cada post. */
export function jsonLdArtigo(artigo: Artigo) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artigo.title,
    description: artigo.excerpt,
    datePublished: artigo.date,
    dateModified: artigo.date,
    inLanguage: "pt-BR",
    articleSection: artigo.category,
    author: { "@type": "Organization", name: artigo.author },
    publisher: { "@id": ID_ESCRITORIO },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${site.url}/artigos/${artigo.slug}`,
    },
  };
}

/** Service da página de área. */
export function jsonLdArea(slug: string) {
  const area = areas.find((item) => item.slug === slug);
  if (!area) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: area.titulo,
    description: area.metaDescricao,
    serviceType: area.nome,
    provider: { "@id": ID_ESCRITORIO },
    areaServed: [
      { "@type": "City", name: "São Paulo" },
      { "@type": "Country", name: "Brasil" },
    ],
    url: `${site.url}/areas-de-atuacao/${area.slug}`,
  };
}

/** BreadcrumbList das páginas internas. */
export function jsonLdMigalhas(itens: { nome: string; caminho: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { nome: "Início", caminho: "/" },
      ...itens,
    ].map((item, indice) => ({
      "@type": "ListItem",
      position: indice + 1,
      name: item.nome,
      item: `${site.url}${item.caminho === "/" ? "" : item.caminho}`,
    })),
  };
}
