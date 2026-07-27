import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fifgroup.co.id" },
      { protocol: "https", hostname: "webcorp-api.fifgroup.co.id" },
      { protocol: 'https', hostname: 'play-lh.googleusercontent.com' },
      { protocol: 'https', hostname: 'is1-ssl.mzstatic.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
};

export default nextConfig;
