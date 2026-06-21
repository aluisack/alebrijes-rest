"use client";
import Link from "next/link";
import Image from "next/image";

interface AlebrijeCard {
  id: string;
  slug: string;
  nombre: string;
  precio: any;
  estado: string;
  fotos: { url: string; urlThumb: string }[];
  artesano: { name: string | null; localidad: string | null };
}

interface Props {
  alebrijes: AlebrijeCard[];
  localSlug?: string;
}

const estadoLabel: Record<string, string> = {
  DISPONIBLE: "Disponible",
  APARTADO: "Apartado",
  VENDIDO: "Vendido",
};

const estadoClass: Record<string, string> = {
  DISPONIBLE: "bg-emerald-100 text-emerald-800",
  APARTADO: "bg-amber-100 text-amber-800",
  VENDIDO: "bg-stone-100 text-stone-500",
};

export function GaleriaGrid({ alebrijes, localSlug }: Props) {
  return (
    <div className="galeria-masonry max-w-6xl mx-auto">
      {alebrijes.map((alebrije, i) => {
        const foto = alebrije.fotos[0];
        const href = `/alebrije/${alebrije.slug}${localSlug ? `?local=${localSlug}` : ""}`;
        return (
          <Link
            key={alebrije.id}
            href={href}
            className="block group relative overflow-hidden bg-stone-200 fade-up"
            style={{ animationDelay: `${i * 40}ms` }}
          >
            {foto ? (
              <Image
                src={foto.urlThumb || foto.url}
                alt={alebrije.nombre}
                width={400}
                height={533}
                className="w-full object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
              />
            ) : (
              <div className="aspect-[3/4] bg-stone-200 flex items-center justify-center">
                <span className="text-stone-400 text-xs">Sin foto</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <p className="text-white text-xs font-medium truncate">{alebrije.nombre}</p>
              <p className="text-white/70 text-xs truncate">{alebrije.artesano.name}</p>
            </div>
            {alebrije.estado !== "DISPONIBLE" && (
              <div className="absolute top-2 right-2">
                <span className={`tag text-xs ${estadoClass[alebrije.estado]}`}>
                  {estadoLabel[alebrije.estado]}
                </span>
              </div>
            )}
            <div className="absolute bottom-2 left-2">
              <span className="bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                ${Number(alebrije.precio).toLocaleString("es-MX")} MXN
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
