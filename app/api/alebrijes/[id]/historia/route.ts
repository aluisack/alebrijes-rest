import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { generarHistoriaAlebrije } from "@/lib/claude";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const alebrije = await prisma.alebrije.findUnique({
    where: { slug: params.id },
    include: { artesano: { select: { nombre: true, localidad: true } } },
  });

  if (!alebrije) {
    return new Response("No encontrado", { status: 404 });
  }

  const stream = await generarHistoriaAlebrije(
    alebrije.nombre,
    alebrije.animales,
    alebrije.artesano.nombre,
    alebrije.artesano.localidad ?? "Oaxaca"
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
