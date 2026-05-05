import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    where: { stock: { gt: 0 } },
    include: {
      images: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json(products);
}
