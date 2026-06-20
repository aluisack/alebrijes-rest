import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const alebrije = await prisma.alebrije.findUnique({
    where: { id: params.id },
    include: { fotos: true, artesano: { select: { nombre: true, localidad: true, whatsapp: true } } },
  });
  if (!alebrije) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(alebrije);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const body = await req.json();
  const alebrije = await prisma.alebrije.findFirst({ where: { id: params.id, artesanoId: session.user.id } });
  if (!alebrije) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  const updated = await prisma.alebrije.update({ where: { id: params.id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  const alebrije = await prisma.alebrije.findFirst({ where: { id: params.id, artesanoId: session.user.id } });
  if (!alebrije) return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  await prisma.alebrije.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
