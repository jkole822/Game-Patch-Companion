import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@": path.resolve(__dirname),
    },
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        condition: {
          path: "icons/**", // Apply SVGR only to files in the 'icons' directory
        },
        as: "*.js",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
