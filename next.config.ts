import type { NextConfig } from "next";

const repo = "Ufuk-ve-Sedef";
const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: isProd ? `/${repo}` : "",
  assetPrefix: isProd ? `/${repo}/` : "",
  compress: true,
  reactStrictMode: true,
};

export default nextConfig;
