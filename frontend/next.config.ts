import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  output: 'standalone',
  cacheComponents: true,
  partialPrefetching: true,
};

export default nextConfig;
