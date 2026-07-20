import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Allow phones / other devices on the LAN to load the Next.js dev server.
  allowedDevOrigins: [
    "192.168.3.118",
    "192.168.*.*",
    "10.*.*.*",
    "localhost",
  ],
  turbopack: {
    root: path.join(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
