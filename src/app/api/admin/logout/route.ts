import { NextResponse } from "next/server";
import { clearAdminSession } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminSession();
  } catch {
    /* cookie ya ausente */
  }
  return NextResponse.json({ ok: true });
}
