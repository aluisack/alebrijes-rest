import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { GaleriaGrid } from "@/components/galeria/GaleriaGrid";
import { NavBar } from "@/components/ui/NavBar";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

async function getLocal(slug: string) {
  return prisma.local.findUnique({
    where: { slug },
    include: {
      promotor: { select: { nombre: true } },
      catalogo: {
        where: { estado: "APROBADO" },
        orderBy: { orden: "asc" },
        include: {
          alebrije: {
            include: {
              fotos: { where: { esPrincipal: true }, take: 1 },
              artesano: { select: { nombre: true, localidad: true } },
            },
          },
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const local = await getLocal(params.slug);
  if (!local) return {};
  return {
    title: `Galería de Alebrijes — ${local.nombre}`,
    description: `Colección de alebrijes oaxaqueños curada especialmente para ${local.nombre}. Escanea para explorar y comprar.`,
  };
}

export default async function LocalGaleriaPage({ params }: Props) {
  const local = await getLocal(params.slug);
  if (!local) notFound();

  const alebrijes = local.catalogo.map((item) => item.alebrije);

  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />

      {/* Encabezado del local */}
      <section className="pt-24 pb-10 px-6 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
          <span className="text-xs text-amber-700 font-medium">
            Colección curada para
          </span>
          <span className="text-xs font-semibold text-amber-900">
            {local.nombre}
          </span>
        </div>
        <h1 className="font-display text-3xl md:text-5xl text-stone-900 mb-3">
          Alebrijes <span className="italic text-amber-700">Originales</span>
        </h1>
        <p className="text-stone-400 text-sm max-w-xs mx-auto">
          {alebrijes.length} piezas únicas disponibles · Arte popular directo
          del artesano a tus manos
        </p>
      </section>

      {/* Galería */}
      <section className="px-3 pb-16">
        {alebrijes.length > 0 ? (
          <GaleriaGrid alebrijes={alebrijes} localSlug={params.slug} />
        ) : (
          <div className="text-center py-20 text-stone-400">
            <p className="text-lg">Esta galería está siendo preparada</p>
            <p className="text-sm mt-1">Vuelve pronto</p>
          </div>
        )}
      </section>

      <footer className="border-t border-stone-200 py-6 px-6 text-center">
        <p className="text-xs text-stone-400">
          alebrijes.rest — Conectando artesanos oaxaqueños con el mundo
        </p>
      </footer>
    </main>
  );
}
