import { prisma } from "@/lib/prisma";
import { mapDbProductToStoreProduct } from "@/lib/store-product";
import { CatalogoClient } from "./catalogo-client";

export const dynamic = "force-dynamic";

export default async function CatalogoPage() {
  if (!process.env.DATABASE_URL) {
    return <CatalogoClient initialProducts={[]} />;
  }

  const rows = await prisma.product
    .findMany({
      where: { stock: { gt: 0 } },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  const products = rows.map(mapDbProductToStoreProduct);

  return <CatalogoClient initialProducts={products} />;
}
