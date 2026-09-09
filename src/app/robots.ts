import type { MetadataRoute } from "next";

import { site } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // O painel não é conteúdo do site: fica fora dos buscadores.
    rules: [{ userAgent: "*", allow: "/", disallow: "/admin" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
