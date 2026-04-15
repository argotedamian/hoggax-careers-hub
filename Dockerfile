# Dockerfile para Next.js - Development y Production

# ============================================
# STAGE 1: Development
# ============================================
FROM node:22-alpine AS development

WORKDIR /app

# Instalar dependencias primero (cache layer)
COPY package.json package-lock.json* ./
RUN npm ci

# Copiar todo el código
COPY . .

# Desarrollo con hot reload
EXPOSE 3000
CMD ["npm", "run", "dev"]

# ============================================
# STAGE 2: Production Build
# ============================================
FROM node:22-alpine AS builder

WORKDIR /app

# Instalar solo production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copiar código necesario para build
COPY --from=development /app/node_modules ./node_modules
COPY . .

# Build de Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ============================================
# STAGE 3: Production Runner
# ============================================
FROM node:22-alpine AS runner

WORKDIR /app

# Crear usuario no-root para seguridad
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos del build
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Variables de entorno
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Puerto y usuario
USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]