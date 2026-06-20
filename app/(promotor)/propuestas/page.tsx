import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/ui/NavBar";
import { GestionCatalogo } from "@/components/promotor/GestionCatalogo";

export default async function PropuestasPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.rol !== "PROMOTOR") redirect("/");

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
        orderBy: { creadoEn: "desc" },
      },
    },
  });

  if (!local) redirect("/catalogo");

  const propuestas = local.catalogo.filter((i) => i.estado === "PROPUESTO");
  const aprobadas = local.catalogo.filter((i) => i.estado === "APROBADO");

  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <h1 className="font-display text-2xl text-stone-900 mb-1">Propuestas</h1>
        <p className="text-stone-400 text-sm mb-8">
          {propuestas.length} propuesta{propuestas.length !== 1 ? "s" : ""} pendiente{propuestas.length !== 1 ? "s" : ""}
        </p>
        <GestionCatalogo
          localId={local.id}
          propuestas={propuestas}
          aprobadas={aprobadas}
        />
      </div>
    </main>
  );
}
