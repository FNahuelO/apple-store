import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  fullName: z.string().min(3),
  phone: z.string().min(8),
  email: z.string().email().optional().or(z.literal("")),
  city: z.string().optional(),
  brand: z.string().min(2),
  model: z.string().min(2),
  storage: z.string().optional(),
  condition: z.string().min(2),
  batteryHealth: z.number().int().min(0).max(100).optional().nullable(),
  details: z.string().optional(),
  desiredModel: z.string().optional(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const data = parsed.data;
  const tradeIn = await prisma.tradeInRequest.create({
    data: {
      ...data,
      email: data.email || null,
      batteryHealth: data.batteryHealth ?? null,
    },
  });

  return NextResponse.json({ ok: true, id: tradeIn.id }, { status: 201 });
}
