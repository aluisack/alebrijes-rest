import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LoginButton } from "@/components/ui/LoginButton";

export default async function LoginPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-3xl text-stone-900 mb-2">
          alebrijes<span className="text-amber-600">.rest</span>
        </h1>
        <p className="text-stone-400 text-sm mb-8">
          Portal de artesanos y promotores
        </p>
        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <p className="text-stone-600 text-sm mb-6">
            Ingresa con tu cuenta de Google para gestionar tus piezas o tu catálogo.
          </p>
          <LoginButton />
          <p className="text-xs text-stone-400 mt-4">
            ¿Primera vez? Tu cuenta se crea automáticamente.
          </p>
        </div>
        <p className="text-xs text-stone-400 mt-6">
          ¿Solo quieres explorar?{" "}
          <a href="/" className="text-amber-600 hover:underline">
            Ver la galería pública
          </a>
        </p>
      </div>
    </main>
  );
}
