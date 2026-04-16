# Lambda Form Handler

AWS Lambda + S3 para manejar el formulario de postulaciones.

## Arquitectura

```
[S3 Static Site] --POST--> [Lambda] --> [S3 Bucket (CVs)] --> [n8n Webhook]
```

## Buckets S3

| Bucket | Uso |
|--------|-----|
| `aws1-hoggax-careers-hub` | Frontend (app estática) |
| `hoggax-careers-cvs` | CVs (archivos subidos) |

---

## Crear la Lambda

### 1. En AWS Console

1. Ir a [AWS Lambda](https://console.aws.amazon.com/lambda)
2. **Create function**
3. **Author from scratch**
   - **Name**: `hoggax-form-handler`
   - **Runtime**: `Node.js 20.x`
   - **Architecture**: `x86_64`
4. **Create function**

### 2. Pegar el código

**Código completo (ESM)**:

```javascript
// ===========================================
// AWS Lambda - Form Handler para HOGGAX
// ===========================================

const CONFIG = {
  S3_BUCKET: "hoggax-careers-cvs",
  N8N_WEBHOOK_URL: null, // "https://tu-servidor.n8n.io/webhook/form"
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};

import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({ region: "us-east-1" });

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const generateUUID = () => "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
  const r = Math.random() * 16 | 0;
  const v = c === "x" ? r : (r & 0x3 | 0x8);
  return v.toString(16);
});

const uploadToS3 = async (base64Content, filename) => {
  const buffer = Buffer.from(base64Content, "base64");
  const key = `cv/${filename}`;
  const command = new PutObjectCommand({
    Bucket: CONFIG.S3_BUCKET,
    Key: key,
    Body: buffer,
    ContentType: "application/pdf",
    ACL: "public-read",
  });
  await s3Client.send(command);
  return `https://${CONFIG.S3_BUCKET}.s3.amazonaws.com/${key}`;
};

export const handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: CORS_HEADERS, body: "" };
  }

  console.log("=== New form submission ===");

  try {
    const body = event.body ? JSON.parse(event.body) : {};

    // Honeypot - silently ignore
    if (body.website) {
      console.log("Honeypot triggered - ignoring");
      return { 
        statusCode: 200, 
        headers: CORS_HEADERS, 
        body: JSON.stringify({ ok: true, message: "Application submitted successfully" }) 
      };
    }

    const { name, email, linkedin, position, areas, message, cv } = body;
    console.log("Processing:", name, email, position);

    // Validaciones
    if (!name || name.length < 2) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Name is required" }) };
    }
    if (!email || !email.includes("@")) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Valid email is required" }) };
    }
    if (!position) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: "Position is required" }) };
    }

    // Subir CV a S3 si existe
    let cvUrl = "";
    if (cv && cv.length > 0) {
      const ext = ".pdf";
      const uuid = generateUUID();
      const timestamp = Date.now();
      const filename = `${uuid}-${timestamp}${ext}`;
      
      try {
        cvUrl = await uploadToS3(cv, filename);
        console.log("CV uploaded:", cvUrl);
      } catch (s3Error) {
        console.error("S3 error:", s3Error);
        return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: "Failed to upload CV" }) };
      }
    }

    // Enviar a n8n si está configurado
    if (CONFIG.N8N_WEBHOOK_URL) {
      const payload = {
        name, email, linkedin, position,
        areas: areas || [],
        message: message || "",
        cvUrl,
        submittedAt: new Date().toISOString(),
        source: "hoggax-careers-form",
      };

      try {
        await fetch(CONFIG.N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (n8nError) {
        console.error("n8n error:", n8nError);
      }
    }

    console.log("Success!");

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, message: "Application submitted successfully" }),
    };

  } catch (error) {
    console.error("Lambda error:", error);
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: "Internal server error" }) };
  }
};
```

### 3. Agregar permisos S3

1. **Configuration** > **Permissions** > Click en el rol (ej: `hoggax-form-handler-role-xxx`)
2. **Add permissions** > **Attach policies**
3. Buscar y agregar: `AmazonS3FullAccess`

O crear política personalizada:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject"
      ],
      "Resource": "arn:aws:s3:::hoggax-careers-cvs/*"
    }
  ]
}
```

### 4. Configurar Function URL (opcional)

1. En la Lambda > **Function URL** > **Enable**
2. **Auth type**: `NONE` (público)
3. **Save**

---

## Probar la Lambda

### Test desde AWS Console

1. Lambda > **Test** > **Test event** > **New**
2. Pegar:

```json
{
  "httpMethod": "POST",
  "body": "{\"name\":\"Juan Perez\",\"email\":\"juan@email.com\",\"linkedin\":\"https://linkedin.com/in/juanperez\",\"position\":\"Desarrollador Frontend\",\"areas\":[\"Tecnología\"]}"
}
```

3. **Test**

### Test con curl

```bash
curl -X POST "https://TU-LAMBDA-URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Juan Perez","email":"juan@email.com","linkedin":"https://linkedin.com/in/juanperez","position":"Desarrollador Frontend"}'
```

### Probar Honeypot

```bash
curl -X POST "https://TU-LAMBDA-URL" \
  -H "Content-Type: application/json" \
  -d '{"name":"Bot","email":"bot@bot.com","position":"Test","website":"spam"}'
```

Debería responder **"ok": true** pero sin procesar nada.

---

## Configurar n8n Webhook

### 1. Crear webhook en n8n

1. Ir a n8n > **Workflows** > **New**
2. Agregar nodo **Webhook**
   - **Webhook URL**: copiar esta URL
   - **Response Mode**: "Last Node"
3. Conectar nodos para enviar email, guardar en DB, etc.

### 2. Actualizar Lambda con webhook

```javascript
const CONFIG = {
  S3_BUCKET: "hoggax-careers-cvs",
  N8N_WEBHOOK_URL: "https://tu-servidor.n8n.io/webhook/form", // ← Tu webhook
  MAX_FILE_SIZE: 5 * 1024 * 1024,
};
```

---

## Estructura del payload

```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "linkedin": "https://linkedin.com/in/juanperez",
  "position": "Desarrollador Frontend",
  "areas": ["Tecnología", "Diseño"],
  "message": "Hola...",
  "cv": "JVBERi0xLjQK...", // PDF en base64
  "cvUrl": "https://hoggax-careers-cvs.s3.amazonaws.com/cv/xxx.pdf", // URL pública del CV
  "submittedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Costos estimados

| Servicio | Uso | Costo |
|----------|-----|-------|
| Lambda | ~100 req/mes | $0 (free tier) |
| S3 (CVs) | ~100MB | ~$0.01/mes |
| Data Transfer | ~10GB/mes | ~$0.90/mes |
| **Total** | | **~$1/mes** |

---

## Troubleshooting

### Error: "require is not defined"
- Usar `import` en lugar de `require` (ESM)

### Error: "exports is not defined"
- Usar `export const handler` en lugar de `exports.handler`

### Error: 403 Forbidden on S3
- Verificar bucket policy tiene permisos de lectura pública

### Error: "Failed to upload CV"
- Verificar permisos de S3 en el rol de la Lambda

### Error: 504 Timeout
- Aumentar timeout en Lambda (default 3s → 30s)

---

## Monitoring

Ver logs en:
```
AWS > Lambda > hoggax-form-handler > Monitor > CloudWatch
```