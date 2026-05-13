import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const tradeIns = await prisma.tradeInRequest.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tradeIns);
}
