import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

const productSchema = z.object({
  sku: z.string().min(2),
  name: z.string().min(2),
  brand: z.string().default("Apple"),
  model: z.string().min(2),
  color: z.string().min(2),
  storage: z.number().int().positive(),
  batteryHealth: z.number().int().min(0).max(100).optional().nullable(),
  condition: z.string().min(2),
  priceArs: z.number().positive(),
  stock: z.number().int().min(0),
  featured: z.boolean().default(false),
  description: z.string().optional(),
  images: z.array(imageSchema).min(1),
});

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    include: { images: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = productSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  const product = await prisma.product.create({
    data: {
      sku: data.sku,
      name: data.name,
      brand: data.brand,
      model: data.model,
      color: data.color,
      storage: data.storage,
      batteryHealth: data.batteryHealth ?? null,
      condition: data.condition,
      priceArs: data.priceArs,
      stock: data.stock,
      featured: data.featured,
      description: data.description,
      images: {
        create: data.images,
      },
    },
    include: { images: true },
  });

  return NextResponse.json(product, { status: 201 });
}
