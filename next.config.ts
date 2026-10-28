import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
    // Inline the (small, Tailwind) CSS into <head> so it doesn't block
    // rendering on a separate request. Production builds only.
    inlineCss: true,
    serverActions: {
      allowedOrigins: ["blog.abhimanyyuagarrwal.com", "localhost:3433"],
    },
  },
  images: {
    // AVIF is much smaller than WebP; browsers without AVIF still get WebP.
    formats: ["image/avif", "image/webp"],
    // The defaults plus 400: blog cards are 387px wide on desktop, just over
    // 384, so without it a 1x screen downloads the 640px version.
    imageSizes: [32, 48, 64, 96, 128, 256, 384, 400],
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
