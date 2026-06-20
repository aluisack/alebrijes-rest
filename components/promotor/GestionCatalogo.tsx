"use client";
import { useState } from "react";
import Image from "next/image";

interface CatalogoItem {
  id: string;
  estado: string;
  destacado: boolean;
  alebrije: {
    nombre: string;
    precio: any;
    fotos: { url: string; urlThumb: string }[];
    artesano: { nombre: string };
  };
}

interface Props {
  localId: string;
  propuestas: CatalogoItem[];
  aprobadas: CatalogoItem[];
}

export function GestionCatalogo({ localId, propuestas, aprobadas }: Props) {
  const [propuestasList, setPropuestas] = useState(propuestas);
  const [aprobadasList, setAprobadas] = useState(aprobadas);

  const actualizarEstado = async (
    itemId: string,
    estado: "APROBADO" | "RECHAZADO"
  ) => {
    const res = await fetch("/api/catalogo", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, estado }),
    });
    if (res.ok) {
      const item = propuestasList.find((p) => p.id === itemId);
      if (item && estado === "APROBADO") {
        setPropuestas((prev) => prev.filter((p) => p.id !== itemId));
        setAprobadas((prev) => [...prev, { ...item, estado: "APROBADO" }]);
      } else {
        setPropuestas((prev) => prev.filter((p) => p.id !== itemId));
      }
    }
  };

  return (
    <div>
      {/* Propuestas pendientes */}
      {propuestasList.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
            Propuestas pendientes ({propuestasList.length})
          </h2>
          <div className="space-y-2">
            {propuestasList.map((item) => (
              <div
                key={item.id}
                className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-4"
              >
                <div className="w-12 h-14 bg-stone-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.alebrije.fotos[0] && (
                    <Image
                      src={item.alebrije.fotos[0].urlThumb}
                      alt={item.alebrije.nombre}
                      width={48}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-stone-900 truncate">
                    {item.alebrije.nombre}
                  </p>
                  <p className="text-xs text-stone-400">
                    {item.alebrije.artesano.nombre} ·{" "}
                    ${Number(item.alebrije.precio).toLocaleString("es-MX")} MXN
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => actualizarEstado(item.id, "APROBADO")}
                    className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Aprobar
                  </button>
                  <button
                    onClick={() => actualizarEstado(item.id, "RECHAZADO")}
                    className="text-xs border border-stone-300 text-stone-500 px-3 py-1.5 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Catálogo aprobado */}
      <section>
        <h2 className="text-sm font-medium text-stone-500 uppercase tracking-wide mb-3">
          En tu catálogo ({aprobadasList.length})
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {aprobadasList.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-stone-200 rounded-xl overflow-hidden"
            >
              <div className="aspect-[3/4] bg-stone-100 overflow-hidden">
                {item.alebrije.fotos[0] && (
                  <Image
                    src={item.alebrije.fotos[0].urlThumb}
                    alt={item.alebrije.nombre}
                    width={200}
                    height={267}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-stone-900 truncate">
                  {item.alebrije.nombre}
                </p>
                <p className="text-xs text-stone-400">
                  ${Number(item.alebrije.precio).toLocaleString("es-MX")} MXN
                </p>
                {item.destacado && (
                  <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full mt-1 inline-block">
                    Destacado en tarjeta
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
