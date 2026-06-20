# alebrijes.rest

Galería de arte popular oaxaqueño — conecta artesanos con turistas a través de códigos QR en restaurantes, hoteles y locales.

## Stack

- **Framework**: Next.js 14 (App Router)
- **Base de datos**: PostgreSQL + Prisma (Supabase)
- **Autenticación**: NextAuth.js con Google OAuth
- **Imágenes**: Cloudinary
- **IA**: Anthropic Claude (historias de alebrijes en streaming)
- **Deploy**: Vercel

## Arquitectura de usuarios

| Rol | Acceso | Qué puede hacer |
|-----|--------|-----------------|
| Artesano | `/dashboard`, `/subir`, `/mis-piezas` | Subir piezas, proponer a promotores |
| Promotor | `/catalogo`, `/propuestas`, `/qr` | Aprobar piezas, generar QR |
| Turista | `/`, `/local/[slug]`, `/alebrije/[slug]` | Ver galería, apartar piezas |

## Setup local

### 1. Clonar y instalar

```bash
git clone https://github.com/tu-usuario/alebrijes.rest
cd alebrijes.rest
npm install
```

### 2. Variables de entorno

```bash
cp .env.example .env.local
```

Llenar en `.env.local`:

- **DATABASE_URL**: Crear proyecto en [supabase.com](https://supabase.com), copiar la connection string de PostgreSQL
- **NEXTAUTH_SECRET**: `openssl rand -base64 32`
- **Google OAuth**: Crear proyecto en [console.cloud.google.com](https://console.cloud.google.com), habilitar Google+ API, crear OAuth 2.0 credentials con redirect URI `http://localhost:3000/api/auth/callback/google`
- **Cloudinary**: Crear cuenta en [cloudinary.com](https://cloudinary.com), copiar credenciales del dashboard
- **Anthropic**: Obtener API key en [console.anthropic.com](https://console.anthropic.com)

### 3. Base de datos

```bash
# Crear las tablas
npm run db:push

# Llenar con datos de ejemplo
npm run db:seed
```

### 4. Correr en desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

Probar la galería de demo: [http://localhost:3000/local/casa-oaxaca](http://localhost:3000/local/casa-oaxaca)

## Deploy en Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Variables de entorno en Vercel dashboard o:
vercel env add DATABASE_URL
vercel env add NEXTAUTH_SECRET
# ... etc
```

Después del deploy, actualizar `NEXTAUTH_URL` a `https://alebrijes.rest` y agregar el dominio en Google OAuth.

## Estructura del proyecto

```
app/
  (galeria)/          # Rutas públicas (turistas)
    page.tsx          # Galería principal
    alebrije/[slug]/  # Detalle de pieza
    local/[slug]/     # Galería del local (QR)
  (artesano)/         # Portal del artesano
    dashboard/
    mis-piezas/
    subir/
  (promotor)/         # Portal del promotor
    catalogo/
    propuestas/
    qr/
  api/                # API Routes
    auth/
    alebrijes/
    catalogo/
    upload/
    apartado/
    qr/

components/
  galeria/            # GaleriaGrid, DetalleAlebrije, HistoriaIA, FormularioApartado
  artesano/           # SubirPieza
  promotor/           # GestionCatalogo, QRDownloader
  ui/                 # NavBar, Button, Badge

lib/
  prisma.ts           # Cliente Prisma
  auth.ts             # NextAuth config
  cloudinary.ts       # Upload helper
  qr.ts               # QR generator
  claude.ts           # AI historia streaming

prisma/
  schema.prisma       # Schema completo
  seed.ts             # Datos de ejemplo
```

## Flujo editorial

1. **Artesano** sube fotos de su pieza con descripción, técnica y precio
2. **Artesano** propone la pieza al promotor desde su dashboard
3. **Promotor** aprueba o rechaza desde `/propuestas`
4. La pieza aprobada aparece en la galería de ese local
5. **Promotor** descarga QR + tarjeta imprimible desde `/qr`
6. **Turistas** escanean, exploran y apartan piezas

## Feature de IA

En el detalle de cada alebrije, el botón "Escuchar la leyenda" llama a Claude que genera en streaming una historia poética basada en los animales y el artesano. El texto aparece token por token — el efecto visual es muy impactante.

El endpoint es `GET /api/alebrijes/[slug]/historia` y hace streaming de la respuesta de Anthropic directamente al cliente.

## Próximos pasos

- [ ] Email al artesano cuando se aparta una pieza (Resend o Nodemailer)
- [ ] Upload múltiple de fotos con drag-and-drop
- [ ] Analytics de escaneos de QR por local
- [ ] Versión bilingüe español/inglés
- [ ] Página de perfil público del artesano
- [ ] Integración con Stripe para pago en línea
