import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuração para SPA (Single Page Application)
  output: "export",
  trailingSlash: true,

  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ["@radix-ui/react-icons", "lucide-react"],
  },

  reactStrictMode: true,

  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // swcMinify removido - é padrão no Next.js 13+
  poweredByHeader: false,
};

export default nextConfig;
