"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { EstadoAlebrije } from "@prisma/client";
import { FormularioApartado } from "./FormularioApartado";
import { HistoriaIA } from "./HistoriaIA";

interface Foto {
  id: string;
  url: string;
  urlThumb: string;
  esPrincipal: boolean;
  orden: number;
}

interface Artesano {
  id: string;
  name: string | null;
  localidad: string | null;
  bio: string | null;
  whatsapp: string | null;
}

interface AlebrijeDetalle {
  id: string;
  slug: string;
  name: string | null;
  descripcion: string;
  tecnica: string;
  animales: string[];
  dimensiones: string;
  precio: any;
  estado: EstadoAlebrije;
  fotos: Foto[];
  artesano: Artesano;
}

export function DetalleAlebrije({ alebrije }: { alebrije: AlebrijeDetalle }) {
  const [fotoActiva, setFotoActiva] = useState(0);
  const [mostrarApartado, setMostrarApartado] = useState(false);
  const disponible = alebrije.estado === "DISPONIBLE";

  const waUrl = alebrije.artesano.whatsapp
    ? `https://wa.me/${alebrije.artesano.whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(
        `Hola ${alebrije.artesano.name}, me interesa el alebrije "${alebrije.nombre}" que vi en alebrijes.rest`
      )}`
    : null;

  return (
    <main className="min-h-screen bg-stone-50">
      {/* Back */}
      <div className="pt-6 px-4 md:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-stone-400 text-sm hover:text-stone-700 transition-colors"
        >
          ← Galería
        </Link>
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 grid md:grid-cols-2 gap-10">
        {/* Fotos */}
        <div>
          {/* Foto principal */}
          <div className="aspect-[4/5] bg-stone-100 overflow-hidden rounded-sm mb-3">
            {alebrije.fotos[fotoActiva] && (
              <Image
                src={alebrije.fotos[fotoActiva].url}
                alt={alebrije.nombre}
                width={800}
                height={1000}
                className="w-full h-full object-cover"
                priority
              />
            )}
          </div>

          {/* Thumbnails */}
          {alebrije.fotos.length > 1 && (
            <div className="flex gap-2">
              {alebrije.fotos.map((foto, i) => (
                <button
                  key={foto.id}
                  onClick={() => setFotoActiva(i)}
                  className={`w-16 h-20 overflow-hidden rounded-sm border-2 transition-colors ${
                    i === fotoActiva
                      ? "border-stone-800"
                      : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={foto.urlThumb}
                    alt={`${alebrije.nombre} ángulo ${i + 1}`}
                    width={64}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-1">
            <span className={`tag text-xs ${
              disponible
                ? "bg-emerald-100 text-emerald-800"
                : "bg-amber-100 text-amber-800"
            }`}>
              {disponible ? "Disponible" : alebrije.estado === "APARTADO" ? "Apartado" : "Vendido"}
            </span>
          </div>

          <h1 className="font-display text-3xl md:text-4xl text-stone-900 mt-2 mb-1">
            {alebrije.nombre}
          </h1>

          <p className="text-2xl font-medium text-amber-700 mb-4">
            ${Number(alebrije.precio).toLocaleString("es-MX")}{" "}
            <span className="text-sm text-stone-400 font-normal">MXN</span>
          </p>

          <p className="text-stone-600 text-sm leading-relaxed mb-6">
            {alebrije.descripcion}
          </p>

          {/* Datos técnicos */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "Técnica", value: alebrije.tecnica },
              { label: "Dimensiones", value: alebrije.dimensiones },
              {
                label: "Animales",
                value: alebrije.animales.join(" · "),
              },
              { label: "Origen", value: alebrije.artesano.localidad || "Oaxaca" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-stone-100 rounded-lg p-3">
                <p className="text-xs text-stone-400 mb-0.5">{label}</p>
                <p className="text-sm font-medium text-stone-800">{value}</p>
              </div>
            ))}
          </div>

          {/* Historia con IA */}
          <HistoriaIA
            alebrijeSlug={alebrije.slug}
            nombre={alebrije.nombre}
            animales={alebrije.animales}
          />

          {/* Artesano */}
          <div className="flex items-start gap-3 py-4 border-t border-b border-stone-200 my-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-medium text-sm flex-shrink-0">
              {alebrije.artesano.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-900">
                {alebrije.artesano.name}
              </p>
              <p className="text-xs text-stone-400">
                {alebrije.artesano.localidad}
              </p>
              {alebrije.artesano.bio && (
                <p className="text-xs text-stone-500 mt-1 leading-relaxed line-clamp-2">
                  {alebrije.artesano.bio}
                </p>
              )}
            </div>
          </div>

          {/* Acciones */}
          {disponible && (
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => setMostrarApartado(true)}
                className="btn-primary text-center"
              >
                Apartar esta pieza
              </button>
              {waUrl && (
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-whatsapp justify-center">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  Contactar al artesano
                </a>
              )}
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: alebrije.nombre,
                      text: `Mira este alebrije oaxaqueño: ${alebrije.nombre}`,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
                className="btn-secondary text-center"
              >
                Compartir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal apartado */}
      {mostrarApartado && (
        <FormularioApartado
          alebrijeId={alebrije.id}
          nombreAlebrije={alebrije.nombre}
          onClose={() => setMostrarApartado(false)}
        />
      )}
    </main>
  );
}
