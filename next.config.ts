import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.glow.nepdora.baliyoventures.com",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
