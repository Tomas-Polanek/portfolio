import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Screenshots of repositories opted in with the `portfolio` topic (src/lib/projects.ts).
    remotePatterns: [{ protocol: "https", hostname: "raw.githubusercontent.com", pathname: "/Tomas-Polanek/**" }],
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
