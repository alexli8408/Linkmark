import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.s3.*.amazonaws.com",
      },
      ...(process.env.CLOUDFRONT_DOMAIN
        ? [
            {
              protocol: "https" as const,
              hostname: process.env.CLOUDFRONT_DOMAIN,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
