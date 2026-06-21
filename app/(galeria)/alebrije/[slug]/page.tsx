import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { DetalleAlebrije } from "@/components/galeria/DetalleAlebrije";
import type { Metadata } from "next";

interface Props {
  params: { slug: string };
}

async function getAlebrije(slug: string) {
  return prisma.alebrije.findUnique({
    where: { slug },
    include: {
      fotos: { orderBy: { orden: "asc" } },
      artesano: {
        select: {
          id: true,
          name: true,
          localidad: true,
          bio: true,
          whatsapp: true,
        },
      },
    },
  });
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const alebrije = await getAlebrije(params.slug);
  if (!alebrije) return {};
  return {
    title: `${alebrije.nombre} — Alebrije Oaxaqueño`,
    description: alebrije.descripcion,
    openGraph: {
      images: alebrije.fotos[0]?.url ? [alebrije.fotos[0].url] : [],
    },
  };
}

export default async function AlebrijevPage({ params }: Props) {
  const alebrije = await getAlebrije(params.slug);
  if (!alebrije || !alebrije.publicado) notFound();

  return <DetalleAlebrije alebrije={alebrije} />;
}
