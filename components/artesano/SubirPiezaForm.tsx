"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const ANIMALES_COMUNES = [
  "jaguar", "ocelote", "águila", "quetzal", "serpiente", "colibrí",
  "mariposa monarca", "venado", "armadillo", "iguana", "murciélago",
  "tlacuache", "puma", "coyote", "lechuza", "ajolote", "pez sierra",
];

export function SubirPiezaForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotos, setFotos] = useState<{ file: File; preview: string }[]>([]);
  const [animales, setAnimales] = useState<string[]>([]);
  const [animalesInput, setAnimalesInput] = useState("");
  const [estado, setEstado] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    tecnica: "",
    dimensiones: "",
    precio: "",
  });

  const handleFotos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const nuevas = files.slice(0, 5 - fotos.length).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setFotos((prev) => [...prev, ...nuevas]);
  };

  const eliminarFoto = (i: number) => {
    setFotos((prev) => prev.filter((_, idx) => idx !== i));
  };

  const agregarAnimal = (animal: string) => {
    const a = animal.trim().toLowerCase();
    if (a && !animales.includes(a) && animales.length < 5) {
      setAnimales((prev) => [...prev, a]);
      setAnimalesInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fotos.length === 0) { setError("Sube al menos una foto"); return; }
    if (animales.length === 0) { setError("Agrega al menos un animal"); return; }
    setEstado("loading");
    setError("");

    try {
      // 1. Crear el alebrije
      const res = await fetch("/api/alebrijes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          precio: parseFloat(form.precio),
          animales,
        }),
      });
      if (!res.ok) throw new Error("Error al crear la pieza");
      const alebrije = await res.json();

      // 2. Subir fotos
      for (let i = 0; i < fotos.length; i++) {
        const fd = new FormData();
        fd.append("file", fotos[i].file);
        fd.append("alebrijeId", alebrije.id);
        fd.append("esPrincipal", i === 0 ? "true" : "false");
        const r = await fetch("/api/upload", { method: "POST", body: fd });
        if (!r.ok) throw new Error("Error al subir foto");
      }

      setEstado("ok");
      setTimeout(() => router.push("/mis-piezas"), 1500);
    } catch (e: any) {
      setError(e.message ?? "Error desconocido");
      setEstado("error");
    }
  };

  if (estado === "ok") {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🎉</p>
        <h2 className="font-display text-xl text-stone-900 mb-1">¡Pieza guardada!</h2>
        <p className="text-stone-400 text-sm">Redirigiendo a tus piezas...</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      {/* Fotos */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Fotografías <span className="text-stone-400 font-normal">(hasta 5, la primera será la portada)</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-3">
          {fotos.map((f, i) => (
            <div key={i} className="relative w-24 h-28 rounded-lg overflow-hidden border border-stone-200">
              <Image src={f.preview} alt="" fill className="object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                  Portada
                </span>
              )}
              <button
                type="button"
                onClick={() => eliminarFoto(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center"
              >×</button>
            </div>
          ))}
          {fotos.length < 5 && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-24 h-28 border-2 border-dashed border-stone-300 rounded-lg flex flex-col items-center justify-center text-stone-400 hover:border-stone-400 hover:text-stone-600 transition-colors"
            >
              <span className="text-2xl leading-none">+</span>
              <span className="text-xs mt-1">Foto</span>
            </button>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFotos}
        />
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Nombre de la pieza
        </label>
        <input
          type="text"
          required
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Tlapalxolo, Xochicuetzpal..."
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
        />
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Descripción
        </label>
        <textarea
          required
          value={form.descripcion}
          onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
          rows={4}
          placeholder="Cuenta la historia de esta pieza — qué la inspira, qué la hace especial..."
          className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400 resize-none"
        />
      </div>

      {/* Animales */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Animales que lo componen
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {animales.map((a) => (
            <span
              key={a}
              className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs px-3 py-1 rounded-full"
            >
              {a}
              <button
                type="button"
                onClick={() => setAnimales((prev) => prev.filter((x) => x !== a))}
                className="ml-1 text-amber-600 hover:text-amber-900"
              >×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            value={animalesInput}
            onChange={(e) => setAnimalesInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") { e.preventDefault(); agregarAnimal(animalesInput); }
            }}
            placeholder="Escribe un animal y presiona Enter..."
            className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
          />
          <button
            type="button"
            onClick={() => agregarAnimal(animalesInput)}
            className="px-4 py-2.5 bg-stone-100 text-stone-700 rounded-xl text-sm hover:bg-stone-200 transition-colors"
          >
            +
          </button>
        </div>
        {/* Sugerencias */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          {ANIMALES_COMUNES.filter(
            (a) => !animales.includes(a) && a.includes(animalesInput.toLowerCase())
          ).slice(0, 8).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => agregarAnimal(a)}
              className="text-xs text-stone-500 border border-stone-200 px-2.5 py-1 rounded-full hover:border-stone-400 hover:text-stone-700 transition-colors"
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* Técnica y dimensiones */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Técnica</label>
          <input
            type="text"
            required
            value={form.tecnica}
            onChange={(e) => setForm({ ...form, tecnica: e.target.value })}
            placeholder="Tallado en copal..."
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Dimensiones</label>
          <input
            type="text"
            required
            value={form.dimensiones}
            onChange={(e) => setForm({ ...form, dimensiones: e.target.value })}
            placeholder="28 × 18 × 12 cm"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
          />
        </div>
      </div>

      {/* Precio */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">
          Precio (MXN)
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">$</span>
          <input
            type="number"
            required
            min="1"
            step="0.01"
            value={form.precio}
            onChange={(e) => setForm({ ...form, precio: e.target.value })}
            placeholder="3,200"
            className="w-full border border-stone-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:border-stone-400"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 text-sm">MXN</span>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={estado === "loading"}
          className="btn-primary flex-1 disabled:opacity-50"
        >
          {estado === "loading" ? "Guardando..." : "Guardar pieza"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
