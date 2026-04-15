# Medidas de Seguridad - portalempleo.hoggax.com

Documentación de las medidas de seguridad implementadas en el formulario de postulaciones.

---

## Resumen

| Medida | Estado | Ubicación |
|--------|--------|-----------|
| Rate Limiting | ✅ Implementado | `src/lib/rate-limit.ts` |
| CSRF Protection | ✅ Implementado | `src/app/api/applications/route.ts` |
| Sanitización de Inputs | ✅ Implementado | `src/lib/sanitize.ts` |
| Validación de Archivo | ✅ Implementado | `route.ts` |
| Logging/Auditoría | ✅ Implementado | `route.ts` |

---

## 1. Rate Limiting

### Propósito
Prevenir spam, automatización maliciosa, y ataques de fuerza bruta.

### Implementación
```typescript
// src/lib/rate-limit.ts
const WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS = 5; // 5 postulaciones por IP por ventana
```

### Comportamiento
- **Límite**: 5 requests por IP por minuto
- **Al exceder**: Retorna `429 Too Many Requests`
- **Header**: `Retry-After: <segundos>`

### Limites
- In-memory (se resetea al reiniciar el container)
- Para producción con múltiples instancias: usar Redis/Upstash

### Código relevante
```typescript
export function checkRateLimit(ip: string) {
  // Returns: { allowed: boolean, remaining: number, resetIn: number }
}
```

---

## 2. CSRF Protection

### Propósito
Prevenir ataques de Cross-Site Request Forgery.

### Implementación
1. **GET `/api/applications`**: Genera un token CSRF
2. **POST**: Valida el token antes de procesar

### Flujo
```
1. Usuario entra a la página
2. useEffect() llama a GET /api/applications
3. Servidor retorna: { token: "uuid", expiresAt: 1713123456789 }
4. Frontend guarda token + expiration
5. Usuario envía formulario
6. Frontend envía csrf_token + csrf_expires en el formData
7. Servidor_valida token antes de procesar
```

### Validación
- Token debe existir
- Token no debe estar vacío
- Timestamp no debe haber expirado (> Date.now())
- Retorna 403 si falla

### Código relevante
```typescript
// GET - generar token
export async function GET() {
  const token = crypto.randomUUID();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 min
  return json({ token, expiresAt });
}

// POST - validar
const csrfToken = asString(incoming.get("csrf_token"));
const csrfExpires = asString(incoming.get("csrf_expires"));
if (!csrfToken || !csrfExpires) {
  return json({ ok: false, error: "Security validation failed" }, { status: 403 });
}
if (Date.now() > parseInt(csrfExpires, 10)) {
  return json({ ok: false, error: "Session expired" }, { status: 403 });
}
```

---

## 3. Sanitización de Inputs

### Propósito
Prevenir XSS (Cross-Site Scripting) y inyección de código malicioso.

### Funciones
```typescript
// src/lib/sanitize.ts

// Sanitiza nombre - remove caracteres especiales
sanitizeName(name: string): string

// Sanitiza email - solo caracteres válidos
sanitizeEmail(email: string): string

// Sanitiza LinkedIn URL
sanitizeLinkedIn(url: string): string

// Sanitiza área - whitelist
sanitizeArea(area: string): string
```

### Ejemplos
| Input | Output | Notas |
|-------|--------|-------|
| `<script>alert(1)</script>` | `` | Removido |
| `Juan'; DROP TABLE--` | `Juan DROP TABLE` | Limpiado |
| `test@example.com` | `test@example.com` | Lowercase |
| `https://evil.com` | `` | No es linkedin.com |

---

## 4. Validación de Archivo (CV)

### Propósitos
- Prevenir malware
- Prevenir archivos grandes (DoS)
- Asegurar formato esperado

### Validaciones
- **Tipo MIME**: Solo `application/pdf`
- **Tamaño**: M��ximo 5MB
- **Extensión**: No validada (usa MIME type)

### Código
```typescript
if (cv.type !== "application/pdf") {
  return json({ error: "CV must be a PDF" }, { status: 400 });
}
if (cv.size > MAX_FILE_SIZE) {
  return json({ error: "CV exceeds 5MB" }, { status: 400 });
}
```

---

## 5. Logging y Auditoría

### Propósito
Registro de intentos para análisis y respuesta a incidentes.

### Logs generados
```typescript
// Rate limit bloqueado
console.warn(`[RATE-LIMIT] IP blocked: ${clientIp}, retry in ...s`)

// CSRF inválido
console.warn(`[CSRF] Missing token from ${clientIp}`)

// Validación fallida
console.warn(`[VALIDATION] Invalid email from ${clientIp}`)

// Aplicación exitosa
console.log(`[SUBMIT] Application received from ${email} (IP: ${clientIp})`)
```

### Formato de logs
```
[TIMESTAMP] [LEVEL] Message
[2024-04-14T12:00:00Z] [RATE-LIMIT] IP blocked: 1.2.3.4, retry in 45s
```

---

## 6. Encabezados de Seguridad (futuro)

### Recomendados
```typescript
// próximas implementaciones
- 'X-Content-Type-Options': 'nosniff'
- 'X-Frame-Options': 'DENY'
- 'Content-Security-Policy': "..."
```

---

## Configuración de Variables

### Desarrollo (.env.local)
```bash
WEBHOOK_URL="http://host.docker.internal:5678/webhook/n8n"
```

### Producción
```bash
WEBHOOK_URL="https://tu-n8n.com/webhook/..."
```

---

## Tests de Seguridad

### Rate Limiting
```bash
# Enviar 6requests en 1 minuto (debe fallar el 6to)
for i in {1..6}; do
  curl -X POST "http://localhost:3000/api/applications" \
    -F "csrf_token=test" -F "csrf_expires=9999999999999" \
    -F "name=test" -F "email=test$i@test.com" \
    -F "linkedin=https://linkedin.com/in/test" \
    -F "position=test" -F "cv=@test.pdf;type=application/pdf"
done
# Último debe retornar 429
```

### CSRF
```bash
# Sin token
curl -X POST "http://localhost:3000/api/applications" -F "name=test"
# Debe retornar 403

# Con token expirado
curl -X POST "http://localhost:3000/api/applications" \
  -F "csrf_token=test" -F "csrf_expires=1" -F "name=test"
# Debe retornar 403
```

---

## Notas de Producción

### Rate Limiting
El rate limiter actual es in-memory:
- Se resetea al reiniciar el container
- No shared entre múltiples instancias

**Para producción con múltiples instancias**:
- Usar Redis: `src/lib/rate-limit-redis.ts` (no implementado)
- O Upstash: `@upstash/ratelimit`

### Logging
Los logs van a stdout del container.

### Monitoreo
- Cloudflare Analytics para requests bloqueados
- Logs del container para auditoría

---