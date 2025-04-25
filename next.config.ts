import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
// next.config.js

module.exports = {
  experimental: {
    turbopack: true, // Enable Turbopack for fast development
  },
};
