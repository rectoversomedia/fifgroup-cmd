import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fifgroup.co.id" },
      { protocol: "https", hostname: "webcorp-api.fifgroup.co.id" },
    ],
  },
};

export default nextConfig;
