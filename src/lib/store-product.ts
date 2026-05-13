import type { ProductCondition } from "@/lib/constants";

/** Producto normalizado para catálogo y tarjetas (DB o mock). */
export type StoreProduct = {
  id: string;
  name: string;
  model: string;
  storage: string;
  color: string;
  condition: ProductCondition;
  batteryHealth?: number;
  price: number;
  oldPrice?: number;
  description: string;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  isOnSale: boolean;
  images: string[];
};

export function mapDbConditionToUi(condition: string): ProductCondition {
  const c = condition.toLowerCase();
  if (c.includes("reacond")) return "reacondicionado";
  if (c.includes("nuevo")) return "nuevo";
  return "usado";
}

export function mapDbProductToStoreProduct(p: {
  id: string;
  name: string;
  model: string;
  color: string;
  storage: number;
  condition: string;
  batteryHealth: number | null;
  priceArs: { toString(): string } | number | string;
  stock: number;
  featured: boolean;
  description: string | null;
  images: { url: string }[];
}): StoreProduct {
  const priceRaw = p.priceArs;
  const price =
    typeof priceRaw === "object" && priceRaw !== null && "toString" in priceRaw
      ? Number(priceRaw.toString())
      : Number(priceRaw);

  return {
    id: p.id,
    name: p.name,
    model: p.model,
    storage: `${p.storage}GB`,
    color: p.color,
    condition: mapDbConditionToUi(p.condition),
    batteryHealth: p.batteryHealth ?? undefined,
    price,
    description: p.description ?? "",
    stock: p.stock,
    isActive: p.stock > 0,
    isFeatured: p.featured,
    isOnSale: false,
    images: p.images.map((i) => i.url).filter((u) => typeof u === "string" && u.trim().length > 0),
  };
}
