# Medidas de Seguridad - portalempleo.hoggax.com

Documentación de las medidas de seguridad implementadas en el sitio estático + Lambda.

---

## Resumen

| Medida | Estado | Ubicación |
|--------|--------|-----------|
| S3 Bucket Policy | ✅ Solo lectura pública | AWS Console |
| HTTPS/TLS | ✅ Cloudflare + CloudFront | DNS |
| Lambda Function URL | ✅ Sin auth (solo public) | Lambda config |
| Rate Limiting | ⚠️ En n8n | n8n workflow |
| Input Validation | ✅ Frontend + Lambda | FormSection.tsx |
| CV Validation | ✅ Tamaño < 6MB | Lambda |
| Logging | ✅ CloudWatch | AWS Console |

---

## 1. S3 Bucket Policy

### Propósito
Permitir solo lectura pública de archivos estáticos.

### Configuración
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::aws1-hoggax-careers-hub/*"
    }
  ]
}
```

### Qué hace
- **Permite**:Cualquier persona puede LEER archivos (`GetObject`)
- **NO permite**: WRITE, DELETE, LIST (solo lectura)
- Los archivos subidos sondeanónimos, no hay escritura

---

## 2. HTTPS/TLS

### Cloudflare
- **SSL/TLS mode**: "Full" o "Flexible"
- **Always Use HTTPS**: Enabled

### CloudFront (opcional)
- **Viewer Protocol Policy**: Redirect HTTP to HTTPS
- **Origin Protocol Policy**: HTTPS Only

---

## 3. Lambda Function URL

### Propósito
Exponer el handler del formulario públicamente.

### Configuración
- **Auth type**: `NONE` (público, sin API key)
- **CORS**: Configurado en Lambda

### Seguridad
- La Lambda está expuesta públicamente por diseño
- **Protegida por**: n8n webhook (URL secreta)
- Rate limiting implementado en n8n

### Código de la Lambda
```javascript
export const handler = async (event) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Handle preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  // Procesar formulario
  const body = JSON.parse(event.body);
  // ... validación y envío a n8n
};
```

---

## 4. Rate Limiting (n8n)

### Propósito
Prevenir spam y abuso del formulario.

### Implementación
En n8n, agregar nodo **IF** antes de procesar:

```
{{ $json.rateLimitExceeded }}
  - true → Discard, responder error
  - false → Procesar
```

### Configuración en n8n
1. Agregar nodo **Code** o función
2. implementar contador de requests por IP
3. Guardar en Redis/Upstash para persistencia

---

## 5. Validación de Input

### Frontend (FormSection.tsx)
```typescript
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateLinkedIn = (url: string): boolean => {
  const linkedInRegex = /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedInRegex.test(url);
};
```

### Backend (Lambda)
```javascript
const required = ["name", "email", "position"];
for (const field of required) {
  if (!body[field]) {
    return { statusCode: 400, body: JSON.stringify({ error: `Missing: ${field}` }) };
  }
}
```

---

## 6. Validación de Archivo (CV)

### Propósitos
- Prevenir malware
- Prevenir archivos muy grandes (DoS)
- Asegurar formato PDF

### Frontend
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

if (selectedFile.type !== "application/pdf") {
  setErrors({ cv: "El archivo debe ser PDF" });
}
if (selectedFile.size > MAX_FILE_SIZE) {
  setErrors({ cv: "El archivo no puede exceder 5MB" });
}
```

### Lambda
- Límite de payload: 6MB (límite de Lambda)
- Si el CV es mayor, considerar S3 presigned URL

---

## 7. Logging y Monitoreo

### AWS CloudWatch
- **Lambda > Monitor > View CloudWatch logs**
- Logs de cada request:
  - Body recibido
  - Errores de validación
  - Respuesta de n8n

### Logs de ejemplo
```json
{
  "requestId": "abc-123",
  "timestamp": "2024-01-15T10:30:00Z",
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "status": 200
}
```

### Alertas
Configurar en CloudWatch:
- **Errors**: > 0 en 5 minutos
- **Duration**: > 5000ms

---

## 8. Encabezados de Seguridad

### CloudFront
En **Response headers policy**:

| Header | Value |
|--------|-------|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | DENY |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Content-Security-Policy | default-src 'self' |

---

## Variables de Entorno

### Lambda
```bash
# Requerido
N8N_WEBHOOK_URL=https://tu-n8n.io/webhook/form
```

### S3
```
# No hay variables de entorno para S3 estático
```

---

## Checklist de Seguridad

- [ ] Bucket S3 con policy de solo lectura
- [ ] HTTPS forzado en Cloudflare
- [ ] CloudFront con headers de seguridad
- [ ] Lambda con CORS configurado
- [ ] Rate limiting en n8n
- [ ] Validación en frontend
- [ ] Validación en Lambda
- [ ] Logging en CloudWatch
- [ ] Alertas configuradas

---

## Monitoreo

| Métrica |Dónde ver | Alerta |
|--------|---------|-------|
| Requests totales | CloudWatch | > 1000/día |
| Errors | CloudWatch | > 0 |
| Duration | CloudWatch | > 5s |
| n8n executions | n8n dashboard | - |