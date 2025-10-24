import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kkoouuya-recipe-app-images-dev.s3.amazonaws.com",
        pathname: "/recipes/**",
      },
    ],
  },
};

export default nextConfig;
