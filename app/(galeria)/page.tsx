import { GaleriaGrid } from "@/components/galeria/GaleriaGrid";
import { NavBar } from "@/components/ui/NavBar";

export const dynamic = "force-dynamic";

async function getAlebrijes() {
  try {
    const { prisma } = await import("@/lib/prisma");
    return await prisma.alebrije.findMany({
      where: { publicado: true },
      include: {
        fotos: { where: { esPrincipal: true }, take: 1 },
        artesano: { select: { name: true, localidad: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (e) {
    return [];
  }
}

export default async function GaleriaPage() {
  const alebrijes = await getAlebrijes();
  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />
      <section className="pt-24 pb-12 px-6 text-center">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-3">
          Arte popular oaxaqueño
        </p>
        <h1 className="font-display text-4xl md:text-6xl text-stone-900 mb-4 leading-tight">
          Criaturas del<br />
          <span className="italic text-amber-700">Monte Sagrado</span>
        </h1>
        <p className="text-stone-500 max-w-md mx-auto text-sm leading-relaxed">
          Cada alebrije es una pieza única tallada en copal por artesanos de
          San Martín Tilcajete y Arrazola, Oaxaca.
        </p>
      </section>
      <section className="px-3 pb-16">
        <GaleriaGrid alebrijes={alebrijes} />
      </section>
      <footer className="border-t border-stone-200 py-8 px-6 text-center">
        <p className="text-xs text-stone-400">
          alebrijes.rest — Arte popular directo de los artesanos de Oaxaca
        </p>
      </footer>
    </main>
  );
}
