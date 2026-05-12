"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle, Battery, Tag, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatPrice, getConditionLabel, getConditionColor, getWhatsAppLink } from "@/lib/constants";
import type { StoreProduct } from "@/lib/store-product";

type FeaturedProductsProps = {
  products: StoreProduct[];
};

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const featuredProducts = products.filter((p) => p.isFeatured && p.isActive).slice(0, 4);

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12"
        >
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Productos destacados</h2>
            <p className="mt-3 text-lg text-muted-foreground">Los equipos más buscados con stock disponible</p>
          </div>
          <Button asChild variant="ghost" className="self-start sm:self-auto">
            <Link href="/catalogo">
              Ver todo el catálogo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {featuredProducts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
            Pronto vas a ver aquí los productos destacados con stock real.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

interface ProductCardProps {
  product: StoreProduct;
  showFullDescription?: boolean;
}

function ProductImagePlaceholder() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 via-zinc-50 to-slate-100 dark:from-zinc-900 dark:via-zinc-950 dark:to-zinc-900">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.45] dark:opacity-[0.22]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.35) 1px, transparent 0)",
          backgroundSize: "18px 18px",
        }}
      />
      <div className="relative flex flex-col items-center gap-3 px-6">
        <div className="rounded-[1.75rem] border border-white/70 bg-gradient-to-b from-white/90 to-zinc-100/90 p-5 shadow-md ring-1 ring-black/5 dark:border-white/10 dark:from-zinc-800/90 dark:to-zinc-900/90 dark:ring-white/10">
          <Smartphone className="h-12 w-12 text-muted-foreground/55" strokeWidth={1.15} />
        </div>
        <span className="text-center text-[11px] font-medium uppercase tracking-[0.12em] text-muted-foreground/75">
          Foto próximamente
        </span>
      </div>
    </div>
  );
}

export function ProductCard({ product, showFullDescription = false }: ProductCardProps) {
  const whatsappMessage = `Hola! Me interesa el ${product.name} ${product.storage} (${getConditionLabel(product.condition)}) que vi en la web`;

  const firstImageUrl = useMemo(() => {
    for (const u of product.images) {
      const t = typeof u === "string" ? u.trim() : "";
      if (t.length > 0) return t;
    }
    return null;
  }, [product.images]);

  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const showPlaceholder = !firstImageUrl || failedUrl === firstImageUrl;

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-foreground/5">
      <div className="relative aspect-square overflow-hidden bg-muted/40">
        {showPlaceholder ? (
          <ProductImagePlaceholder />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={firstImageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => {
              if (firstImageUrl) setFailedUrl(firstImageUrl);
            }}
          />
        )}

        <div className="absolute left-4 top-4 flex flex-col gap-2">
          {product.isOnSale && (
            <Badge className="border-0 bg-rose-500 text-white hover:bg-rose-500">
              <Tag className="mr-1 h-3 w-3" />
              Oferta
            </Badge>
          )}
          <Badge className={`border ${getConditionColor(product.condition)}`}>{getConditionLabel(product.condition)}</Badge>
        </div>

        <div className="absolute bottom-4 right-4 opacity-0 transition-opacity group-hover:opacity-100">
          <Button asChild size="icon" className="h-12 w-12 rounded-full shadow-lg">
            <a href={getWhatsAppLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
            </a>
          </Button>
        </div>
      </div>

      <div className="p-5">
        <div className="mb-2 flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight">{product.name}</h3>
          <span className="shrink-0 text-sm text-muted-foreground">{product.storage}</span>
        </div>

        <div className="mb-3 flex items-center gap-3 text-sm text-muted-foreground">
          {product.batteryHealth != null && (
            <span className="flex items-center gap-1">
              <Battery className="h-4 w-4" />
              {product.batteryHealth}%
            </span>
          )}
          <span>{product.color}</span>
        </div>

        {showFullDescription && (
          <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">{product.description}</p>
        )}

        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-2xl font-bold">{formatPrice(product.price)}</span>
          {product.oldPrice != null && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>
          )}
        </div>

        <Button asChild className="w-full rounded-xl">
          <a href={getWhatsAppLink(whatsappMessage)} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="mr-2 h-4 w-4" />
            Consultar
          </a>
        </Button>
      </div>
    </div>
  );
}
