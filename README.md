# Hoggax Careers Hub

Portal de carreras y oportunidades laborales de Hoggax.

## Requisitos

- Node.js 18+
- npm

## Instalación

```bash
npm install
```

## Desarrollo local

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

## Variables de entorno

- Crear un `.env.local` usando `.env.local.example`.
- **`NEXT_PUBLIC_API_URL`**: URL del API Gateway para el formulario.

## Build producción

```bash
npm run build
```

## Deploy a S3

```bash
aws s3 sync out/ s3://aws1-hoggax-careers-hub --delete --acl public-read
```

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React 19
- shadcn/ui + Radix UI
- Framer Motion
