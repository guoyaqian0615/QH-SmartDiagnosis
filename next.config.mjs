import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const sharedConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },
};

/** @type {import('next').NextConfig | ((phase: string) => import('next').NextConfig)} */
export default function nextConfig(phase) {
  return {
    ...sharedConfig,
    // Keep dev artifacts isolated so `next build` does not corrupt a running `next dev`.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  };
}
