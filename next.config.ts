import type { NextConfig } from "next";

/* Host do Supabase Storage, de onde vêm as capas enviadas pelo painel.
   Sem isso o next/image recusa a imagem por ser de outro domínio. */
const hostSupabase = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) return null;
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  // Existe outro package-lock.json na pasta do usuário; fixa a raiz aqui.
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    /* Qualidades usadas no site. A partir do Next 16 é obrigatório declarar. */
    qualities: [75, 90, 95],
    // Locais em /public, mais as capas de artigo no Supabase Storage.
    remotePatterns: hostSupabase
      ? [
          {
            protocol: "https" as const,
            hostname: hostSupabase,
            pathname: "/storage/v1/object/public/**",
          },
        ]
      : [],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
