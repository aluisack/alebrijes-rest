"use client";
import { useState } from "react";

interface Props {
  alebrijeId: string;
  nombreAlebrije: string;
  onClose: () => void;
}

export function FormularioApartado({ alebrijeId, nombreAlebrije, onClose }: Props) {
  const [form, setForm] = useState({ nombre: "", email: "", mensaje: "" });
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEstado("loading");
    try {
      const res = await fetch("/api/apartado", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ alebrijeId, ...form }),
      });
      setEstado(res.ok ? "ok" : "error");
    } catch {
      setEstado("error");
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-end md:items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-t-2xl md:rounded-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-lg">Apartar pieza</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700 text-xl leading-none">×</button>
        </div>

        <p className="text-sm text-stone-500 mb-4">
          Estás apartando: <strong className="text-stone-800">{nombreAlebrije}</strong>
        </p>

        {estado === "ok" ? (
          <div className="text-center py-6">
            <p className="text-2xl mb-2">🎉</p>
            <p className="font-medium text-stone-900 mb-1">¡Pieza apartada!</p>
            <p className="text-sm text-stone-500">
              El artesano te contactará en las próximas horas para confirmar.
            </p>
            <button onClick={onClose} className="btn-primary mt-4">
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Tu nombre</label>
              <input
                type="text"
                required
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                placeholder="María González"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">Tu email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400"
                placeholder="maria@correo.com"
              />
            </div>
            <div>
              <label className="text-xs text-stone-500 mb-1 block">
                Mensaje (opcional)
              </label>
              <textarea
                value={form.mensaje}
                onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                rows={3}
                className="w-full border border-stone-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-stone-400 resize-none"
                placeholder="¿Alguna pregunta sobre la pieza o el envío?"
              />
            </div>
            {estado === "error" && (
              <p className="text-xs text-red-600">
                Ocurrió un error. Intenta de nuevo o usa WhatsApp.
              </p>
            )}
            <button
              type="submit"
              disabled={estado === "loading"}
              className="btn-primary w-full disabled:opacity-50"
            >
              {estado === "loading" ? "Enviando..." : "Confirmar apartado"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
