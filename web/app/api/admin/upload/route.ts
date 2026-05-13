import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getCloudinary } from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo inválido" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const cloudinary = getCloudinary();

  const uploaded = await new Promise<{ secure_url: string }>((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder: "apple-la-union/products" }, (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("No se pudo subir la imagen"));
          return;
        }
        resolve({ secure_url: result.secure_url });
      })
      .end(buffer);
  });

  return NextResponse.json({ url: uploaded.secure_url });
}
