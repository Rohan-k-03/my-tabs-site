import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: {},
  outputFileTracingRoot: __dirname,
  
  async redirects() {
    return [
      { source: "/escape", destination: "/escape-room", permanent: true },
    ];
  },
};

export default nextConfig;
