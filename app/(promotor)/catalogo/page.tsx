import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";
import { GestionCatalogo } from "@/components/promotor/GestionCatalogo";

export default async function CatalogoPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.rol !== "PROMOTOR") redirect("/");

  const local = await prisma.local.findFirst({
    where: { promotorId: session.user.id },
    include: {
      catalogo: {
        include: {
          alebrije: {
            include: {
              fotos: { where: { esPrincipal: true }, take: 1 },
              artesano: { select: { nombre: true } },
            },
          },
        },
        orderBy: { orden: "asc" },
      },
    },
  });

  if (!local) {
    return (
      <main className="min-h-screen bg-stone-50">
        <NavBar />
        <div className="max-w-2xl mx-auto px-4 pt-24 text-center">
          <p className="text-stone-500">No tienes un local configurado aún.</p>
          <p className="text-sm text-stone-400 mt-1">Contacta al administrador para activar tu cuenta.</p>
        </div>
      </main>
    );
  }

  const propuestas = local.catalogo.filter((i) => i.estado === "PROPUESTO");
  const aprobadas = local.catalogo.filter((i) => i.estado === "APROBADO");

  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-stone-900">{local.nombre}</h1>
            <p className="text-stone-400 text-sm mt-0.5">
              {aprobadas.length} piezas en tu catálogo ·{" "}
              <Link href={`/local/${local.slug}`} className="text-amber-600 hover:underline">
                Ver galería pública
              </Link>
            </p>
          </div>
          <Link href="/qr" className="btn-secondary text-sm">
            Descargar QR
          </Link>
        </div>

        <GestionCatalogo
          localId={local.id}
          propuestas={propuestas}
          aprobadas={aprobadas}
        />
      </div>
    </main>
  );
}
