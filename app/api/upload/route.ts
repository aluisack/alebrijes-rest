import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadFotoAlebrije } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.rol !== "ARTESANO") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File;
  const alebrijeId = formData.get("alebrijeId") as string;
  const esPrincipal = formData.get("esPrincipal") === "true";

  if (!file || !alebrijeId) {
    return NextResponse.json({ error: "Faltan datos" }, { status: 400 });
  }

  // Verificar que el alebrije pertenece al artesano
  const alebrije = await prisma.alebrije.findFirst({
    where: { id: alebrijeId, artesanoId: session.user.id },
  });

  if (!alebrije) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const { url, urlThumb } = await uploadFotoAlebrije(buffer, alebrije.slug);

  // Si es principal, desmarcar las anteriores
  if (esPrincipal) {
    await prisma.fotoAlebrije.updateMany({
      where: { alebrijeId },
      data: { esPrincipal: false },
    });
  }

  const totalFotos = await prisma.fotoAlebrije.count({ where: { alebrijeId } });

  const foto = await prisma.fotoAlebrije.create({
    data: {
      alebrijeId,
      url,
      urlThumb,
      esPrincipal: esPrincipal || totalFotos === 0,
      orden: totalFotos,
    },
  });

  return NextResponse.json(foto, { status: 201 });
}
