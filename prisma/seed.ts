import { PrismaClient, Rol } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🎨 Sembrando la galería de alebrijes...");

  const manuel = await prisma.user.upsert({
    where: { email: "manuel@alebrijes.rest" },
    update: {},
    create: {
      email: "manuel@alebrijes.rest",
      name: "Manuel Ramírez Cruz",
      rol: Rol.ARTESANO,
      whatsapp: "+529511234567",
      localidad: "San Martín Tilcajete, Oaxaca",
      bio: "Tercera generación de talladores de copal.",
    },
  });

  const lucia = await prisma.user.upsert({
    where: { email: "lucia@alebrijes.rest" },
    update: {},
    create: {
      email: "lucia@alebrijes.rest",
      name: "Lucía Mendoza Vásquez",
      rol: Rol.ARTESANO,
      whatsapp: "+529517654321",
      localidad: "Arrazola, Oaxaca",
      bio: "Especializada en piezas miniatura de alta precisión.",
    },
  });

  const casaOaxaca = await prisma.user.upsert({
    where: { email: "arte@casaoaxaca.com" },
    update: {},
    create: {
      email: "arte@casaoaxaca.com",
      name: "Casa Oaxaca Arte",
      rol: Rol.PROMOTOR,
    },
  });

  const local = await prisma.local.upsert({
    where: { slug: "casa-oaxaca" },
    update: {},
    create: {
      promotorId: casaOaxaca.id,
      nombre: "Casa Oaxaca",
      slug: "casa-oaxaca",
      tipo: "restaurante",
      direccion: "García Vigil 407, Oaxaca de Juárez",
    },
  });

  const piezas = [
    {
      artesanoId: manuel.id,
      nombre: "Tlapalxolo",
      slug: "tlapalxolo",
      descripcion: "Jaguar alado con alas de mariposa monarca.",
      tecnica: "Tallado en copal, pintado con anilinas naturales",
      animales: ["jaguar", "mariposa monarca"],
      dimensiones: "28 × 18 × 12 cm",
      precio: 3200,
      estado: "DISPONIBLE" as const,
      publicado: true,
      fotos: [{ url: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800", urlThumb: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400", esPrincipal: true, orden: 0 }],
    },
    {
      artesanoId: manuel.id,
      nombre: "Xochicuetzpal",
      slug: "xochicuetzpal",
      descripcion: "Lagartija de las flores. Criatura de buen augurio.",
      tecnica: "Tallado en copal, pintado con pincel de un pelo",
      animales: ["lagartija", "quetzal"],
      dimensiones: "15 × 8 × 5 cm",
      precio: 1800,
      estado: "DISPONIBLE" as const,
      publicado: true,
      fotos: [{ url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800", urlThumb: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400", esPrincipal: true, orden: 0 }],
    },
    {
      artesanoId: manuel.id,
      nombre: "Atl-Ocelotl",
      slug: "atl-ocelotl",
      descripcion: "El ocelote del agua. Mitad felino, mitad pez.",
      tecnica: "Tallado en copal, pintado con acrílicos",
      animales: ["ocelote", "pez sierra"],
      dimensiones: "35 × 20 × 15 cm",
      precio: 4500,
      estado: "DISPONIBLE" as const,
      publicado: true,
      fotos: [{ url: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=800", urlThumb: "https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=400", esPrincipal: true, orden: 0 }],
    },
    {
      artesanoId: lucia.id,
      nombre: "Quetzalcoatl Miniatura",
      slug: "quetzalcoatl-miniatura",
      descripcion: "La serpiente emplumada en su versión más delicada.",
      tecnica: "Tallado de precisión, pintura con aerógrafo",
      animales: ["serpiente", "quetzal"],
      dimensiones: "10 × 6 × 4 cm",
      precio: 2100,
      estado: "DISPONIBLE" as const,
      publicado: true,
      fotos: [{ url: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=800", urlThumb: "https://images.unsplash.com/photo-1615729947596-a598e5de0ab3?w=400", esPrincipal: true, orden: 0 }],
    },
    {
      artesanoId: lucia.id,
      nombre: "Tláloc Venado",
      slug: "tlaloc-venado",
      descripcion: "El dios de la lluvia encarnado en venado.",
      tecnica: "Tallado en copal negro, pintado con pigmentos minerales",
      animales: ["venado", "aguila"],
      dimensiones: "42 × 30 × 18 cm",
      precio: 6800,
      estado: "DISPONIBLE" as const,
      publicado: true,
      fotos: [{ url: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=800", urlThumb: "https://images.unsplash.com/photo-1518998053901-5348d3961a04?w=400", esPrincipal: true, orden: 0 }],
    },
  ];

  const alebrijesCreados = [];
  for (const pieza of piezas) {
    const { fotos, ...data } = pieza;
    const alebrije = await prisma.alebrije.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, fotos: { create: fotos } },
    });
    alebrijesCreados.push(alebrije);
  }

  for (let i = 0; i < alebrijesCreados.length; i++) {
    const alebrije = alebrijesCreados[i];
    await prisma.catalogoItem.upsert({
      where: { localId_alebrijeId: { localId: local.id, alebrijeId: alebrije.id } },
      update: {},
      create: { localId: local.id, alebrijeId: alebrije.id, estado: "APROBADO", orden: i, destacado: i < 3 },
    });
  }

  console.log(`✅ Artesanos: 2`);
  console.log(`✅ Alebrijes: ${alebrijesCreados.length}`);
  console.log(`✅ Local: ${local.nombre}`);
  console.log(`🎉 ¡Galería lista! Visita: alebrijes.rest/local/casa-oaxaca`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
