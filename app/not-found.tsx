import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-8xl text-stone-200 mb-4">404</p>
        <h1 className="font-display text-2xl text-stone-900 mb-2">
          Esta criatura no existe
        </h1>
        <p className="text-stone-400 text-sm mb-8 max-w-xs mx-auto">
          El alebrije que buscas no está en la galería, o tal vez ya encontró su hogar.
        </p>
        <Link href="/" className="btn-primary">
          Volver a la galería
        </Link>
      </div>
    </main>
  );
}
