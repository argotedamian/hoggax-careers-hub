# API de Postulaciones

---

## `GET /api/applications` - Obtener CSRF Token

Antes de enviar el formulario, el frontend debe obtener un CSRF token.

**URL**: `GET /api/applications`

**Respuesta (200)**:
```json
{
  "token": "uuid-v4",
  "expiresAt": 1713123456789
}
```

**Notas**:
- Token válido por 15 minutos.
- Incluir en el POST como `csrf_token` y `csrf_expires`.

---

## `POST /api/applications` - Enviar Postulación

Endpoint que recibe una postulación, aplica validaciones de seguridad, y **reenvía el mismo payload** a un webhook configurado en `WEBHOOK_URL`.

### Content-Type

- **`multipart/form-data`** (obligatorio)

### Body esperado (multipart/form-data)

Campos requeridos:

| Campo | Tipo | Descripción |
|------|------|-------------|
| `csrf_token` | string | Token CSRF obtenido de GET |
| `csrf_expires` | string | Timestamp de expiración del token |
| `name` | string | Nombre y apellido |
| `email` | string | Email válido |
| `linkedin` | string | URL de LinkedIn |
| `position` | string | Posición seleccionada |
| `areas` | string[] | Áreas de interés (opcional, repetible) |
| `cv` | file | Archivo PDF (máx 5MB) |

### Security Headers

| Header | Descripción |
|--------|------------|
| `X-Forwarded-For` | IP del cliente (para rate limiting) |
| `X-Real-IP` | IP real del cliente |
| `Retry-After` | Segundos hasta retry (cuando 429) |

---

## Validaciones de Seguridad

### 1. Rate Limiting
- **Límite**: 5 postulaciones por IP por minuto
- **Respuesta excedido**: `429 Too Many Requests`
- **Header**: `Retry-After: <segundos>`

### 2. CSRF Protection
Token obligatorio obtenido de GET `/api/applications`:
- `csrf_token`: UUIDv4
- `csrf_expires`: timestamp de expiración (15 min)
- Retorna 403 si falta o expirado

### 3. Sanitización de Inputs
Todos los campos de texto son limpiados:
- `name`: remove caracteres especiales, máx 100 chars
- `email`: lowercase, solo caracteres válidos
- `linkedin`: valida formato URL de LinkedIn
- `areas`: whitelist de valores permitidos

### 4. Validación de Archivo
- Tipo: solo `application/pdf`
- Tamaño: máximo 5MB

---

## Variables de entorno

- **`WEBHOOK_URL`** *(requerida)*: URL del webhook externo que recibe el mismo `multipart/form-data`.

## Respuestas

### 200 OK

```json
{ "ok": true }
```

### 400 Bad Request

Ejemplos:

```json
{ "ok": false, "error": "Expected multipart/form-data" }
```

```json
{ "ok": false, "error": "Missing required fields" }
```

```json
{ "ok": false, "error": "Missing CV file" }
```

```json
{ "ok": false, "error": "CV must be a PDF" }
```

```json
{ "ok": false, "error": "CV exceeds 5MB" }
```

### 502 Bad Gateway

Cuando el webhook responde non-2xx.

```json
{
  "ok": false,
  "error": "Webhook request failed",
  "status": 500,
  "body": "..."
}
```

### 500 Internal Server Error

Cuando falta `WEBHOOK_URL`.

```json
{ "ok": false, "error": "Missing WEBHOOK_URL env var" }
```

## Ejemplo (curl) - con CSRF token

```bash
# 1. Obtener CSRF token
TOKEN_RES=$(curl -s GET "http://localhost:3000/api/applications")
TOKEN=$(echo $TOKEN_RES | jq -r '.token')
EXPIRES=$(echo $TOKEN_RES | jq -r '.expiresAt')

# 2. Enviar postulación
curl -X POST "http://localhost:3000/api/applications" \
  -F "csrf_token=$TOKEN" \
  -F "csrf_expires=$EXPIRES" \
  -F 'name=Juan Pérez' \
  -F 'email=juan@example.com' \
  -F 'linkedin=https://linkedin.com/in/juanperez' \
  -F 'position=Ejecutivo/a Comercial SR.' \
  -F 'areas=Ventas' \
  -F 'areas=Marketing' \
  -F 'cv=@./cv.pdf;type=application/pdf'
```

## Ejemplo (fetch)

```ts
// 1. Obtener CSRF token
const csrfRes = await fetch("/api/applications", { method: "GET" });
const { token, expiresAt } = await csrfRes.json();

// 2. Enviar postulación
const formData = new FormData();
formData.append("csrf_token", token);
formData.append("csrf_expires", String(expiresAt));
formData.append("name", "Juan Pérez");
formData.append("email", "juan@example.com");
formData.append("linkedin", "https://linkedin.com/in/juanperez");
formData.append("position", "Ejecutivo/a Comercial SR.");
formData.append("areas", "Ventas");
formData.append("areas", "Marketing");
formData.append("cv", file, file.name);

await fetch("/api/applications", { method: "POST", body: formData });
```

