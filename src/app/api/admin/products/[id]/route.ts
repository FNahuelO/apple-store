import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

type Context = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_: Request, context: Context) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id } = await context.params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
