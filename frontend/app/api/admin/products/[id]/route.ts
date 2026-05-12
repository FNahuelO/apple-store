import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Context = {
  params: Promise<{ id: string }>;
};

const imageSchema = z.object({
  url: z.string().url(),
  alt: z.string().optional(),
  order: z.number().int().nonnegative().default(0),
});

const productPutSchema = z.object({
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
  featured: z.boolean(),
  description: z.string().optional(),
  images: z.array(imageSchema).min(1),
});

const patchSchema = z
  .object({
    featured: z.boolean().optional(),
    stock: z.number().int().min(0).optional(),
  })
  .refine((d) => d.featured !== undefined || d.stock !== undefined, {
    message: "Se requiere featured o stock",
  });

export async function PUT(request: Request, context: Context) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = productPutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;

  const skuClash = await prisma.product.findFirst({
    where: { sku: data.sku, NOT: { id } },
  });
  if (skuClash) {
    return NextResponse.json({ error: "Ese SKU ya lo usa otro producto" }, { status: 409 });
  }

  try {
    const product = await prisma.product.update({
      where: { id },
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
        description: data.description ?? null,
        images: {
          deleteMany: {},
          create: data.images,
        },
      },
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

export async function PATCH(request: Request, context: Context) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data: { featured?: boolean; stock?: number } = {};
  if (parsed.data.featured !== undefined) data.featured = parsed.data.featured;
  if (parsed.data.stock !== undefined) data.stock = parsed.data.stock;

  try {
    const product = await prisma.product.update({
      where: { id },
      data,
      include: { images: { orderBy: { order: "asc" } } },
    });
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Producto no encontrado" }, { status: 404 });
  }
}

export async function DELETE(_: Request, context: Context) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
