import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const apartadoSchema = z.object({
  alebrijeId: z.string(),
  localId: z.string().optional(),
  nombre: z.string().min(2).max(100),
  email: z.string().email(),
  mensaje: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = apartadoSchema.parse(body);

  // Verificar que el alebrije existe y está disponible
  const alebrije = await prisma.alebrije.findUnique({
    where: { id: data.alebrijeId },
    include: { artesano: { select: { nombre: true, whatsapp: true } } },
  });

  if (!alebrije || alebrije.estado !== "DISPONIBLE") {
    return NextResponse.json(
      { error: "Pieza no disponible" },
      { status: 409 }
    );
  }

  // Crear el apartado y marcar el alebrije como apartado
  const [apartado] = await prisma.$transaction([
    prisma.apartado.create({
      data: {
        alebrijeId: data.alebrijeId,
        localId: data.localId,
        nombreComprador: data.nombre,
        email: data.email,
        mensaje: data.mensaje,
      },
    }),
    prisma.alebrije.update({
      where: { id: data.alebrijeId },
      data: { estado: "APARTADO" },
    }),
  ]);

  // TODO: enviar email al artesano con los datos del comprador
  // await enviarEmailArtesano(alebrije.artesano.email, apartado, alebrije.nombre)

  return NextResponse.json(
    { apartadoId: apartado.id, mensaje: "Pieza apartada exitosamente" },
    { status: 201 }
  );
}
