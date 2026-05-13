import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import {
  getDefaultSiteSettings,
  mergeSiteSettings,
  siteSettingsSchema,
} from "@/lib/site-settings";

const SITE_SETTINGS_ID = 1;

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const row = await prisma.siteSettings.findUnique({
    where: { id: SITE_SETTINGS_ID },
  });
  if (!row) {
    return NextResponse.json(getDefaultSiteSettings());
  }
  return NextResponse.json(mergeSiteSettings(row.data));
}

export async function PUT(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = siteSettingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
  }

  await prisma.siteSettings.upsert({
    where: { id: SITE_SETTINGS_ID },
    create: { id: SITE_SETTINGS_ID, data: parsed.data },
    update: { data: parsed.data },
  });

  return NextResponse.json({ ok: true });
}
