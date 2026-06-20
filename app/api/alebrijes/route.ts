import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { z } from "zod";

const crearAlebrijeSchema = z.object({
  nombre: z.string().min(2).max(100),
  descripcion: z.string().min(10).max(1000),
  tecnica: z.string().min(2).max(200),
  animales: z.array(z.string()).min(1).max(5),
  dimensiones: z.string().min(2).max(100),
  precio: z.number().positive(),
});

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = parseInt(searchParams.get("limit") ?? "20");
  const estado = searchParams.get("estado");

  const alebrijes = await prisma.alebrije.findMany({
    where: {
      publicado: true,
      ...(estado && { estado: estado as any }),
    },
    include: {
      fotos: { where: { esPrincipal: true }, take: 1 },
      artesano: { select: { nombre: true, localidad: true } },
    },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * limit,
    take: limit,
  });

  return NextResponse.json({ alebrijes, page, limit });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.rol !== "ARTESANO") {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = await req.json();
  const data = crearAlebrijeSchema.parse(body);

  // Generar slug único
  const baseSlug = data.nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  let slug = baseSlug;
  let count = 0;
  while (await prisma.alebrije.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${++count}`;
  }

  const alebrije = await prisma.alebrije.create({
    data: {
      ...data,
      slug,
      artesanoId: session.user.id,
      publicado: false, // requiere revisión
    },
  });

  return NextResponse.json(alebrije, { status: 201 });
}
