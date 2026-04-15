/**
 * Rate Limiter simple in-memory
 * Para producción con múltiples instancias, usar Redis (@upstash/ratelimit)
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (resetea en restart del container)
// Para producción: usar Redis o Upstash
const store = new Map<string, RateLimitEntry>();

// Configuración
const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 5; // 5 postulaciones por IP por ventana

/**
 * Verifica si una IP está rate-limited
 * @returns { allowed: boolean, remaining: number, resetIn: number }
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetIn: number;
} {
  const now = Date.now();
  const entry = store.get(ip);

  // Limpiar entradas expiradas
  if (entry && now > entry.resetAt) {
    store.delete(ip);
  }

  // No existe o expiró: permitir
  if (!entry || now > entry.resetAt) {
    store.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  // Ya existe: verificar límite
  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  // Incrementar counter
  entry.count++;
  store.set(ip, entry);
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn: entry.resetAt - now,
  };
}

/**
 * Obtener IP real del request (considerando proxy)
 */
export function getClientIp(headers: Headers): string {
  // Headers comunes de proxy
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }
  return "unknown";
}