import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NavBar } from "@/components/ui/NavBar";
import { QRDownloader } from "@/components/promotor/QRDownloader";

export default async function QRPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.rol !== "PROMOTOR") redirect("/");

  const local = await prisma.local.findFirst({
    where: { promotorId: session.user.id },
    include: {
      catalogo: {
        where: { estado: "APROBADO", destacado: true },
        include: {
          alebrije: {
            include: { fotos: { where: { esPrincipal: true }, take: 1 } },
          },
        },
        take: 3,
        orderBy: { orden: "asc" },
      },
    },
  });

  if (!local) redirect("/catalogo");

  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <h1 className="font-display text-2xl text-stone-900 mb-1">
          Tarjeta de mesa
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          Descarga e imprime para colocar en las mesas de {local.nombre}
        </p>
        <QRDownloader local={local} />
      </div>
    </main>
  );
}
