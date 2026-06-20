import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const schema = z.object({
  itemId: z.string(),
  estado: z.enum(["APROBADO", "RECHAZADO"]),
});

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.rol !== "PROMOTOR") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const { itemId, estado } = schema.parse(body);

  // Verificar que el item pertenece a un local del promotor
  const item = await prisma.catalogoItem.findFirst({
    where: {
      id: itemId,
      local: { promotorId: session.user.id },
    },
  });

  if (!item) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const updated = await prisma.catalogoItem.update({
    where: { id: itemId },
    data: { estado },
  });

  return NextResponse.json(updated);
}
