import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Relax lint/type checks during development; tighten before release.
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  // Defaults are fine; keep this explicit for clarity.
  experimental: {},
  // Ensure file tracing resolves from the project root.
  outputFileTracingRoot: __dirname,
  // If you switch to Turbopack, you may want:
  // turbopack: { root: __dirname },
  async redirects() {
    return [
      { source: "/escape", destination: "/escape-room", permanent: true },
    ];
  },
};

export default nextConfig;
