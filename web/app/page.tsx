import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Benefits } from "@/components/benefits";
import { FeaturedProducts } from "@/components/featured-products";
import { TradeInCTA } from "@/components/trade-in-cta";
import { Testimonials } from "@/components/testimonials";
import { Footer } from "@/components/footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { prisma } from "@/lib/prisma";
import { mapDbProductToStoreProduct } from "@/lib/store-product";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (!process.env.DATABASE_URL) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main>
          <Hero />
          <Benefits />
          <FeaturedProducts products={[]} />
          <TradeInCTA />
          <Testimonials />
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    );
  }

  const rows = await prisma.product
    .findMany({
      where: { stock: { gt: 0 } },
      include: { images: { orderBy: { order: "asc" } } },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    })
    .catch(() => []);

  const products = rows.map(mapDbProductToStoreProduct);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Benefits />
        <FeaturedProducts products={products} />
        <TradeInCTA />
        <Testimonials />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
