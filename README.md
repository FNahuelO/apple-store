# Apple La Union

Plataforma ecommerce para tienda de celulares estilo Apple reseller.

Incluye:
- Frontend de catalogo con stock real
- Backend API con Next.js Route Handlers
- Base de datos PostgreSQL con Prisma
- Panel de administracion (login + alta/baja de productos)
- Subida real de fotos a Cloudinary
- Sistema de consultas por WhatsApp
- Sistema de canje (solicitudes guardadas en DB)

## Requisitos

- Node 20+
- PostgreSQL 15+
- Cuenta de Cloudinary

## Configuracion

1. Copiar variables:

```bash
cp .env.example .env
```

2. Completar `.env` con tus credenciales reales.

3. Aplicar migracion:

```bash
npm run db:migrate
```

4. Generar cliente Prisma:

```bash
npm run db:generate
```

5. Crear admin inicial:

```bash
npm run db:seed
```

## Desarrollo

```bash
npm run dev
```

- Tienda publica: `http://localhost:3000`
- Canje: `http://localhost:3000/canje`
- Admin: `http://localhost:3000/admin/login`

## Despliegue recomendado

- Frontend/API: Vercel
- Base de datos: Neon/Supabase/Render PostgreSQL
- Imagenes: Cloudinary

### Checklist para Vercel

1. Importar el repo en Vercel.
2. En Project Settings -> Environment Variables, cargar las variables de `.env.example`.
3. Configurar `DATABASE_URL` apuntando a una base PostgreSQL de produccion.
4. Deploy (el proyecto ya ejecuta `prisma generate` automaticamente en build).

### Variables requeridas en Vercel

- `DATABASE_URL`
- `JWT_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`

Variables opcionales (para seed de admin):
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_NAME`

Antes de deploy:
- Ejecuta `npm run build` localmente
- Verifica login admin, alta de productos, subida de imagen y formulario de canje
