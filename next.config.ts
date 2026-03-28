import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // @ts-ignore
  turbopack: {
    root: path.resolve("."), 
  },
};

export default nextConfig;
