"use client";
import { useState } from "react";

interface Props {
  alebrijeSlug: string;
  nombre: string;
  animales: string[];
}

export function HistoriaIA({ alebrijeSlug, nombre, animales }: Props) {
  const [historia, setHistoria] = useState("");
  const [cargando, setCargando] = useState(false);
  const [mostrada, setMostrada] = useState(false);

  const generarHistoria = async () => {
    setCargando(true);
    setHistoria("");
    setMostrada(true);

    try {
      const res = await fetch(`/api/alebrijes/${alebrijeSlug}/historia`);
      if (!res.body) return;

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        // Parsear SSE de Anthropic
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data:")) {
            try {
              const data = JSON.parse(line.slice(5));
              if (data.type === "content_block_delta") {
                setHistoria((prev) => prev + (data.delta?.text ?? ""));
              }
            } catch {}
          }
        }
      }
    } catch (e) {
      setHistoria("No fue posible generar la historia en este momento.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="my-4">
      {!mostrada ? (
        <button
          onClick={generarHistoria}
          className="w-full border border-dashed border-amber-300 text-amber-700 rounded-lg py-3 text-sm hover:bg-amber-50 transition-colors flex items-center justify-center gap-2"
        >
          <span>✨</span>
          <span>Escuchar la leyenda de {nombre}</span>
        </button>
      ) : (
        <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
          <p className="text-xs text-amber-600 font-medium mb-2 uppercase tracking-wide">
            La leyenda
          </p>
          {cargando && !historia && (
            <div className="flex gap-1 items-center text-amber-400">
              <span className="animate-bounce text-sm">·</span>
              <span className="animate-bounce text-sm" style={{ animationDelay: "0.1s" }}>·</span>
              <span className="animate-bounce text-sm" style={{ animationDelay: "0.2s" }}>·</span>
            </div>
          )}
          <p className="text-sm text-stone-700 leading-relaxed font-display italic">
            {historia}
            {cargando && <span className="animate-pulse">▍</span>}
          </p>
        </div>
      )}
    </div>
  );
}
