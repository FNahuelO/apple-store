import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminToken, setAdminSession, verifyPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const ok = await verifyPassword(parsed.data.password, user.passwordHash);
  if (!ok) {
    return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 });
  }

  const token = createAdminToken({ userId: user.id, email: user.email });
  await setAdminSession(token);
  return NextResponse.json({ ok: true });
}
