import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
  experimental: {
    // https://nextjs.org/docs/app/api-reference/functions/unauthorized
    authInterrupts: true,
  },
};

export default nextConfig;
