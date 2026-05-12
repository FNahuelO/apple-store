import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** En Vercel el proyecto suele estar en la raíz del repo; Next debe emitir `.next` ahí para el deployer. */
const vercelOutDir = process.env.VERCEL === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(vercelOutDir ? { distDir: path.join(__dirname, "..", ".next") } : {}),
  /** Monorepo: Prisma y paquetes en la raíz del repo (Vercel build desde la raíz). */
  outputFileTracingRoot: path.join(__dirname, ".."),
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
