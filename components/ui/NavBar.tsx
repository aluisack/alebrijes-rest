"use client";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export function NavBar() {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-display text-lg text-stone-900">
          alebrijes<span className="text-amber-600">.rest</span>
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              {session.user.rol === "ARTESANO" && (
                <Link
                  href="/mis-piezas"
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors hidden md:block"
                >
                  Mis piezas
                </Link>
              )}
              {session.user.rol === "PROMOTOR" && (
                <Link
                  href="/catalogo"
                  className="text-xs text-stone-500 hover:text-stone-900 transition-colors hidden md:block"
                >
                  Mi catálogo
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="text-xs text-stone-400 hover:text-stone-700 transition-colors"
              >
                Salir
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="text-xs text-stone-500 hover:text-stone-900 transition-colors border border-stone-200 rounded-full px-3 py-1.5"
            >
              Soy artesano
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
