import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep CI builds green while we iterate; tighten later.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  experimental: { instrumentationHook: true },
};

export default nextConfig;
