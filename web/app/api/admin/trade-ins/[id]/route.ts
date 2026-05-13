import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const patchSchema = z.object({
  status: z.enum(["PENDING", "REVIEWED", "REJECTED", "ACCEPTED"]),
});

type Context = {
  params: Promise<{ id: string }>;
};

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

  try {
    const updated = await prisma.tradeInRequest.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "Solicitud no encontrada" }, { status: 404 });
  }
}
