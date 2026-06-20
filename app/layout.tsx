import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Alebrijes | Arte Popular Oaxaqueño",
  description:
    "Galería de alebrijes originales de Oaxaca. Piezas únicas talladas en copal por artesanos de San Martín Tilcajete y Arrazola.",
  openGraph: {
    title: "Alebrijes | Arte Popular Oaxaqueño",
    description: "Descubre alebrijes únicos de artesanos oaxaqueños",
    images: ["/og-image.jpg"],
    locale: "es_MX",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-stone-50 text-stone-900 antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
