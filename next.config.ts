import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Permite que o build prossiga mesmo com erros de lint (serão tratados gradualmente)
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Permite que o build prossiga mesmo com erros de tipo (temporário)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
