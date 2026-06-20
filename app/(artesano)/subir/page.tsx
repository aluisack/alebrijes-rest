import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { NavBar } from "@/components/ui/NavBar";
import { SubirPiezaForm } from "@/components/artesano/SubirPiezaForm";

export default async function SubirPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.rol !== "ARTESANO") redirect("/");

  return (
    <main className="min-h-screen bg-stone-50">
      <NavBar />
      <div className="max-w-2xl mx-auto px-4 pt-20 pb-16">
        <h1 className="font-display text-2xl text-stone-900 mb-1">Subir nueva pieza</h1>
        <p className="text-stone-400 text-sm mb-8">
          Una vez guardada quedará en borrador. Puedes proponerla a promotores desde "Mis piezas".
        </p>
        <SubirPiezaForm />
      </div>
    </main>
  );
}
