import type { MetadataRoute } from "next";

import { areas } from "@/content/areas";
import { listarArtigos } from "@/lib/artigos";
import { site } from "@/content/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const agora = new Date();
  const artigos = await listarArtigos();

  const rotasFixas: MetadataRoute.Sitemap = [
    { url: `${site.url}/`, changeFrequency: "monthly", priority: 1 },
    { url: `${site.url}/sobre`, changeFrequency: "yearly", priority: 0.7 },
    { url: `${site.url}/equipe`, changeFrequency: "yearly", priority: 0.7 },
    {
      url: `${site.url}/areas-de-atuacao`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    { url: `${site.url}/artigos`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${site.url}/contato`, changeFrequency: "yearly", priority: 0.8 },
    {
      url: `${site.url}/politica-de-privacidade`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const fixas: MetadataRoute.Sitemap = rotasFixas.map((rota) => ({
    ...rota,
    lastModified: agora,
  }));

  const paginasDeAreas: MetadataRoute.Sitemap = areas.map((area) => ({
    url: `${site.url}/areas-de-atuacao/${area.slug}`,
    lastModified: agora,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const paginasDeArtigos: MetadataRoute.Sitemap = artigos.map((artigo) => ({
    url: `${site.url}/artigos/${artigo.slug}`,
    lastModified: new Date(artigo.date),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [...fixas, ...paginasDeAreas, ...paginasDeArtigos];
}
