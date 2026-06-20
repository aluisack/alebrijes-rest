import { NextRequest } from "next/server";
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return new Response("No disponible", { status: 503 });
}
