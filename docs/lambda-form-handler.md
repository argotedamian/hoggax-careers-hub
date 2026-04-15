# Lambda Form Handler

AWS Lambda + n8n para manejar el formulario de postulaciones.

## Arquitectura

```
[S3 Static Site] --POST--> [Lambda Function URL] --> [n8n Webhook] --> [Email/Automation]
```

## Crear la Lambda

### 1. En AWS Console

1. Ir a [AWS Lambda](https://console.aws.amazon.com/lambda)
2. **Create function**
3. **Author from scratch**
   - **Name**: `hoggax-form-handler`
   - **Runtime**: `Node.js 20.x`
   - **Architecture**: `x86_64`
4. **Create function**

### 2. Configurar Function URL

1. En la Lambda creada > **Function URL** > **Enable**
2. **Auth type**: `NONE` (público, sin API key)
3. **Configure**: `Configure per-function`
4. **Save**

Copiar la **Function URL** (ej: `https://xxxxx.execute-api.us-east-1.amazonaws.com/2015-03-31/functions/hoggax-form-handler/invocations`)

### 3. Actualizar código con webhook de n8n

```javascript
// Reemplazar en lambda/form-handler.mjs
const N8N_WEBHOOK_URL = "https://tu-servidor.n8n.io/webhook/form";
```

### 4. Actualizar FormSection.tsx

En `src/components/FormSection.tsx` línea 26:

```typescript
const LAMBDA_URL = "https://xxxxx.execute-api.us-east-1.amazonaws.com/2015-03-31/functions/hoggax-form-handler/invocations";
```

### 5. Permisos (IAM)

La Lambda necesita rol con permisos básicos. Verificar que tenga:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

### 6. Deploy del código

Subir el archivo `lambda/form-handler.mjs` como `index.mjs`:

```bash
# Opción 1: Zip upload
zip function.zip index.mjs
# Subir en Lambda > Code > Upload .zip from

# Opción 2: AWS CLI
aws lambda update-function-code \
  --function-name hoggax-form-handler \
  --zip-file fileb://function.zip
```

## Configurar n8n Webhook

### 1. Crear webhook en n8n

1. Ir a n8n > **Workflows** > **New**
2. Agregar nodo **Webhook**
   - **Webhook URL**: copiar esta URL
   - **Response Mode**: "Last Node"
3. Conectar nodos para enviar email, guardar en DB, etc.

### 2. Webhook de test

URL de test (solo para probar):
```
https://tu-servidor.n8n.io/webhook-form/test
```

URL de producción:
```
https://tu-servidor.n8n.io/webhook-form
```

## Estructura del payload

```json
{
  "name": "Juan Pérez",
  "email": "juan@email.com",
  "linkedin": "https://linkedin.com/in/juanperez",
  "position": "Desarrollador Frontend",
  "areas": ["Tecnología", "Diseño"],
  "cv": "data:application/pdf;base64,...",
  "submittedAt": "2024-01-15T10:30:00.000Z"
}
```

## Costos estimados

| Servicio | Uso | Costo |
|----------|-----|-------|
| Lambda | ~100 req/mes | $0 (free tier) |
| S3 | ~100MB | ~$0.01/mes |
| Data Transfer | ~10GB/mes | ~$0.90/mes |
| **Total** | | **~$1/mes** |

## Troubleshooting

### Error: 403 Forbidden
- Verificar que Function URL tienen Auth type: NONE

### Error: 502 Bad Gateway
- Verificar que la Lambda está desplegada correctamente
- Revisar CloudWatch para logs

### Error: 504 Timeout
- Aumentar timeout en Lambda (default 3s → 30s)

### Error: Payload too large
- El CV en base64 debe ser < 6MB (límite de Lambda)
- Si es mayor, usar S3 presigned URLs

## Monitoring

Ver logs en:
```
AWS > Lambda > hoggax-form-handler > Monitor > CloudWatch
```