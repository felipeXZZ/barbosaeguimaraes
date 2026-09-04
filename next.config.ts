import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Existe outro package-lock.json na pasta do usuário; fixa a raiz aqui.
  outputFileTracingRoot: __dirname,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
    // Todas as imagens são locais, servidas de /public.
    remotePatterns: [],
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
