import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { NavBar } from "@/components/ui/NavBar";
import { ProponeraPromotor } from "@/components/artesano/ProponerAPromotor";

export default async function MisPiezasPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.rol !== "ARTESANO") redirect("/");

  const piezas = await prisma.alebrije.findMany({
    where: { artesanoId: session.user.id },
    include: {
      fotos: { where: { esPrincipal: true }, take: 1 },
      catalogoItems: {
        include: { local: { select: { nombre: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const locales = await prisma.local.findMany({
    select: { id: true, nombre: true, slug: true },
  });

  const estadoClase: Record<string, string> = {
    DISPONIBLE: "tag-disponible",
    APARTADO: "tag-apartado",
    VENDIDO: "tag-vendido",
  };

  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />
      <div className="max-w-4xl mx-auto px-4 pt-20 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-stone-900">Mis piezas</h1>
            <p className="text-stone-400 text-sm mt-0.5">{piezas.length} piezas en total</p>
          </div>
          <Link href="/subir" className="btn-primary">
            + Nueva pieza
          </Link>
        </div>

        {piezas.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-stone-200 rounded-2xl">
            <p className="text-stone-400 mb-4">Aún no tienes piezas subidas</p>
            <Link href="/subir" className="btn-primary">
              Subir mi primer alebrije
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {piezas.map((pieza) => {
              const enLocales = pieza.catalogoItems.filter(
                (ci) => ci.estado === "APROBADO"
              );
              const propuestas = pieza.catalogoItems.filter(
                (ci) => ci.estado === "PROPUESTO"
              );

              return (
                <div
                  key={pieza.id}
                  className="bg-white border border-stone-200 rounded-2xl p-4"
                >
                  <div className="flex items-start gap-4">
                    {/* Foto */}
                    <div className="w-16 h-20 bg-stone-100 rounded-xl overflow-hidden flex-shrink-0">
                      {pieza.fotos[0] ? (
                        <Image
                          src={pieza.fotos[0].urlThumb}
                          alt={pieza.nombre}
                          width={64}
                          height={80}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-stone-300 text-xs">
                          Sin foto
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 flex-wrap">
                        <h3 className="font-medium text-stone-900">{pieza.nombre}</h3>
                        <span className={`tag text-xs ${estadoClase[pieza.estado]}`}>
                          {pieza.estado.toLowerCase()}
                        </span>
                      </div>
                      <p className="text-sm text-amber-700 font-medium mt-0.5">
                        ${Number(pieza.precio).toLocaleString("es-MX")} MXN
                      </p>

                      {/* Estado de catálogos */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        {enLocales.map((ci) => (
                          <span
                            key={ci.id}
                            className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded-full"
                          >
                            ✓ {ci.local.nombre}
                          </span>
                        ))}
                        {propuestas.map((ci) => (
                          <span
                            key={ci.id}
                            className="text-xs bg-amber-50 border border-amber-200 text-amber-700 px-2 py-0.5 rounded-full"
                          >
                            ⏳ Propuesta a {ci.local.nombre}
                          </span>
                        ))}
                      </div>

                      {/* Acciones */}
                      <div className="flex gap-3 mt-3 flex-wrap">
                        <Link
                          href={`/alebrije/${pieza.slug}`}
                          className="text-xs text-stone-500 hover:text-stone-800 transition-colors underline underline-offset-2"
                        >
                          Ver en galería
                        </Link>
                        <ProponeraPromotor
                          alebrijeId={pieza.id}
                          nombreAlebrije={pieza.nombre}
                          locales={locales}
                          yaEnLocales={pieza.catalogoItems.map((ci) => ci.localId)}
                        />
                        <TogglePublicado
                          alebrijeId={pieza.id}
                          publicado={pieza.publicado}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

// Componente inline para toggle publicado
function TogglePublicado({
  alebrijeId,
  publicado,
}: {
  alebrijeId: string;
  publicado: boolean;
}) {
  return (
    <form
      action={async () => {
        "use server";
        await prisma.alebrije.update({
          where: { id: alebrijeId },
          data: { publicado: !publicado },
        });
      }}
    >
      <button
        type="submit"
        className="text-xs text-stone-500 hover:text-stone-800 transition-colors underline underline-offset-2"
      >
        {publicado ? "Despublicar" : "Publicar"}
      </button>
    </form>
  );
}
