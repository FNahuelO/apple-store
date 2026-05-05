import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const products = await prisma.product
    .findMany({
      where: { stock: { gt: 0 } },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-zinc-400">Apple reseller</p>
          <h1 className="text-4xl font-bold">Apple La Union</h1>
          <p className="text-zinc-300">Equipos nuevos y seminuevos con stock real actualizado.</p>
        </div>
        <Link href="/canje" className="rounded-xl border border-white/20 px-4 py-2 font-medium hover:bg-white/10">
          Quiero ofrecer mi equipo en canje
        </Link>
      </header>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/20 p-8 text-zinc-300">
          Todavia no hay productos cargados.
        </div>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}
