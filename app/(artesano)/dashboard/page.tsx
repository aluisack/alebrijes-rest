import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { NavBar } from "@/components/ui/NavBar";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  if (session.user.rol !== "ARTESANO") redirect("/");

  const [totalPiezas, disponibles, apartadas] = await Promise.all([
    prisma.alebrije.count({ where: { artesanoId: session.user.id } }),
    prisma.alebrije.count({ where: { artesanoId: session.user.id, estado: "DISPONIBLE" } }),
    prisma.alebrije.count({ where: { artesanoId: session.user.id, estado: "APARTADO" } }),
  ]);

  const ultimasPiezas = await prisma.alebrije.findMany({
    where: { artesanoId: session.user.id },
    include: { fotos: { where: { esPrincipal: true }, take: 1 } },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <h1 className="font-display text-2xl text-stone-900 mb-1">
          Bienvenido, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="text-stone-400 text-sm mb-8">Tu galería de artesano</p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total piezas", value: totalPiezas },
            { label: "Disponibles", value: disponibles },
            { label: "Apartadas", value: apartadas },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-xl border border-stone-200 p-4 text-center">
              <p className="text-2xl font-medium text-stone-900">{value}</p>
              <p className="text-xs text-stone-400 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Acciones */}
        <div className="flex gap-3 mb-8">
          <Link href="/subir" className="btn-primary">
            + Subir nueva pieza
          </Link>
          <Link href="/mis-piezas" className="btn-secondary">
            Ver todas
          </Link>
        </div>

        {/* Últimas piezas */}
        <h2 className="font-display text-lg mb-4">Últimas piezas subidas</h2>
        <div className="space-y-2">
          {ultimasPiezas.map((pieza) => (
            <div
              key={pieza.id}
              className="bg-white border border-stone-200 rounded-xl p-4 flex items-center gap-4"
            >
              <div className="w-12 h-14 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                {pieza.fotos[0] && (
                  <img
                    src={pieza.fotos[0].urlThumb}
                    alt={pieza.nombre}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 truncate">{pieza.nombre}</p>
                <p className="text-xs text-stone-400">
                  ${Number(pieza.precio).toLocaleString("es-MX")} MXN ·{" "}
                  {pieza.publicado ? "Publicado" : "Borrador"}
                </p>
              </div>
              <span className={`tag text-xs ${
                pieza.estado === "DISPONIBLE"
                  ? "tag-disponible"
                  : pieza.estado === "APARTADO"
                  ? "tag-apartado"
                  : "tag-vendido"
              }`}>
                {pieza.estado.toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
