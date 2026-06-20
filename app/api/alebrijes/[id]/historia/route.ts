import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  return new Response("Servicio de IA no disponible", { status: 503 });
}
