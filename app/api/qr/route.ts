import { NextRequest, NextResponse } from "next/server";
import { generarQR } from "@/lib/qr";

export async function GET(req: NextRequest) {
  const slug = new URL(req.url).searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "Falta slug" }, { status: 400 });

  const qrDataUrl = await generarQR(slug);
  return NextResponse.json({ qrDataUrl });
}
