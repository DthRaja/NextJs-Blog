import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Inline the (small, Tailwind) CSS into <head> so it doesn't block
    // rendering on a separate request. Production builds only.
    inlineCss: true,
  },
  images: {
    // Blog cover and section images uploaded through the CMS
    remotePatterns: [
      new URL("https://solutioninfotechtest.encryptionsoftwares.in/**"),
    ],
  },
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
