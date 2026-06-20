"use client";
import { useEffect, useRef, useState } from "react";

interface Local {
  nombre: string;
  slug: string;
  catalogo: {
    alebrije: {
      nombre: string;
      fotos: { url: string }[];
    };
  }[];
}

export function QRDownloader({ local }: { local: Local }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [qrUrl, setQrUrl] = useState<string>("");
  const [generando, setGenerando] = useState(false);

  useEffect(() => {
    // Generar QR via API
    fetch(`/api/qr?slug=${local.slug}`)
      .then((r) => r.json())
      .then((data) => setQrUrl(data.qrDataUrl))
      .catch(console.error);
  }, [local.slug]);

  const descargar = () => {
    if (!qrUrl) return;
    const a = document.createElement("a");
    a.href = qrUrl;
    a.download = `qr-${local.slug}.png`;
    a.click();
  };

  return (
    <div>
      {/* Vista previa de tarjeta */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6 max-w-sm mx-auto">
        {/* Fotos destacadas */}
        {local.catalogo.length > 0 && (
          <div className={`grid gap-2 mb-4 ${
            local.catalogo.length === 1 ? "grid-cols-1" :
            local.catalogo.length === 2 ? "grid-cols-2" : "grid-cols-3"
          }`}>
            {local.catalogo.map((item, i) => (
              <div key={i} className="aspect-square bg-stone-100 rounded-lg overflow-hidden">
                {item.alebrije.fotos[0] && (
                  <img
                    src={item.alebrije.fotos[0].url}
                    alt={item.alebrije.nombre}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mb-4">
          <p className="font-display text-base text-stone-900 mb-0.5">
            Alebrijes de Oaxaca
          </p>
          <p className="text-xs text-stone-400">Arte popular · Piezas únicas en venta</p>
        </div>

        {/* QR */}
        <div className="flex items-center gap-3 bg-stone-50 rounded-xl p-3">
          {qrUrl ? (
            <img src={qrUrl} alt="QR" className="w-16 h-16 flex-shrink-0" />
          ) : (
            <div className="w-16 h-16 bg-stone-200 rounded animate-pulse flex-shrink-0" />
          )}
          <div>
            <p className="text-xs font-medium text-stone-700">
              Escanea para ver la galería completa
            </p>
            <p className="text-xs text-stone-400 font-mono mt-0.5">
              alebrijes.rest/local/{local.slug}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 max-w-sm mx-auto">
        <button
          onClick={descargar}
          disabled={!qrUrl}
          className="btn-primary text-center disabled:opacity-40"
        >
          Descargar QR (PNG)
        </button>
        <p className="text-xs text-stone-400 text-center">
          Imprime en tamaño 10×15 cm para tarjeta de mesa, o carta para enmarcar.
        </p>
      </div>
    </div>
  );
}
