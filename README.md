# Hoggax Careers Hub

Portal de carreras y oportunidades laborales de Hoggax.

## Requisitos

- Node.js 18+
- npm
- Docker (opcional)

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
- **`WEBHOOK_URL`**: URL del webhook que recibe el `multipart/form-data` (incluye el PDF).

## Docker (opcional)

### Requisitos

- Docker
- Docker Compose

### Comandos con Make

```bash
# Desarrollo con hot reload
make dev

# Producción
make prod

# Ver logs
make logs

# Detener contenedores
make down

# Destruir todo (contenedores + imágenes + volúmenes)
make clean
```

### Comandos Docker directos

```bash
# Desarrollo
docker compose up dev

# Producción
docker compose up --build prod

# Detener
docker compose down
```

## Build producción

```bash
npm run build
npm start
```

## Tech Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React 19
- shadcn/ui + Radix UI
- Framer Motion