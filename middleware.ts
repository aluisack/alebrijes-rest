import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Proteger rutas de artesano
    if (path.startsWith("/dashboard") || path.startsWith("/subir") || path.startsWith("/mis-piezas")) {
      if (token?.rol !== "ARTESANO" && token?.rol !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    // Proteger rutas de promotor
    if (path.startsWith("/catalogo") || path.startsWith("/propuestas") || path.startsWith("/qr")) {
      if (token?.rol !== "PROMOTOR" && token?.rol !== "ADMIN") {
        return NextResponse.redirect(new URL("/login", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/subir/:path*", "/mis-piezas/:path*", "/catalogo/:path*", "/propuestas/:path*", "/qr/:path*"],
};
