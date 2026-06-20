import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  alebrijeId: z.string(),
  localId: z.string(),
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.rol !== "ARTESANO") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { alebrijeId, localId } = schema.parse(body);

  // Verificar que el alebrije pertenece al artesano
  const alebrije = await prisma.alebrije.findFirst({
    where: { id: alebrijeId, artesanoId: session.user.id },
  });
  if (!alebrije) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const item = await prisma.catalogoItem.upsert({
    where: { localId_alebrijeId: { localId, alebrijeId } },
    update: { estado: "PROPUESTO" },
    create: { localId, alebrijeId, estado: "PROPUESTO" },
  });

  return NextResponse.json(item, { status: 201 });
}
