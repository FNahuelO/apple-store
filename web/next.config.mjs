import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Si el deploy es desde la raíz del monorepo (Vercel sin “Root Directory”), emitir `.next` en el repo. */
const nextOutAtMonorepoRoot = process.env.VERCEL_MONOREPO_ROOT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(nextOutAtMonorepoRoot ? { distDir: path.join(__dirname, "..", ".next") } : {}),
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
