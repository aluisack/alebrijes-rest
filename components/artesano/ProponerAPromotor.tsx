"use client";
import { useState } from "react";

interface Local {
  id: string;
  nombre: string;
  slug: string;
}

interface Props {
  alebrijeId: string;
  nombreAlebrije: string;
  locales: Local[];
  yaEnLocales: string[];
}

export function ProponeraPromotor({ alebrijeId, nombreAlebrije, locales, yaEnLocales }: Props) {
  const [open, setOpen] = useState(false);
  const [enviando, setEnviando] = useState<string | null>(null);
  const [enviados, setEnviados] = useState<string[]>([]);

  const disponibles = locales.filter(
    (l) => !yaEnLocales.includes(l.id) && !enviados.includes(l.id)
  );

  const proponer = async (localId: string) => {
    setEnviando(localId);
    try {
      const res = await fetch("/api/catalogo/proponer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alebrijeId, localId }),
      });
      if (res.ok) {
        setEnviados((prev) => [...prev, localId]);
      }
    } finally {
      setEnviando(null);
    }
  };

  if (disponibles.length === 0 && !open) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="text-xs text-amber-600 hover:text-amber-800 transition-colors underline underline-offset-2"
      >
        Proponer a promotor
      </button>

      {open && (
        <div className="absolute top-6 left-0 z-20 bg-white border border-stone-200 rounded-xl shadow-lg p-3 min-w-[200px]">
          <p className="text-xs font-medium text-stone-500 mb-2">
            Proponer "{nombreAlebrije}" a:
          </p>
          {disponibles.length === 0 ? (
            <p className="text-xs text-stone-400">Ya propuesto a todos los locales</p>
          ) : (
            <div className="space-y-1">
              {disponibles.map((local) => (
                <button
                  key={local.id}
                  onClick={() => proponer(local.id)}
                  disabled={enviando === local.id}
                  className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-700 disabled:opacity-50 transition-colors"
                >
                  {enviando === local.id ? "Enviando..." : local.nombre}
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => setOpen(false)}
            className="mt-2 text-xs text-stone-400 hover:text-stone-600 w-full text-center"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );
}
