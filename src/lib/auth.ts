import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const ADMIN_TOKEN = "apple_la_union_admin";

type AdminJwtPayload = {
  userId: string;
  email: string;
};

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string) {
  return bcrypt.compare(password, hash);
}

export function createAdminToken(payload: AdminJwtPayload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET no configurado");
  }
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}

export async function setAdminSession(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_TOKEN);
}

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_TOKEN)?.value;
  const secret = process.env.JWT_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret) as AdminJwtPayload;
    const user = await prisma.adminUser.findUnique({ where: { id: decoded.userId } });
    return user;
  } catch {
    return null;
  }
}
