# Deploy a Producción - portalempleo.hoggax.com

## URLs

- **Producción**: https://portalempleo.hoggax.com
- **Bucket S3**: aws1-hoggax-careers-hub (us-east-1)
- **Staging**: (pending)

## Método de Deploy

| Método | Cuándo usar |
|--------|-----------|
| **S3 Static Export** | Sitio estático (este proyecto usa este método) |
| Docker | Si necesitás API routes dinámicas |

---

## Requisitos Previos

- [ ] AWS CLI instalado y configurado
- [ ] Bucket S3 creado y configurado
- [ ] Permisos IAM con acceso a S3

## Paso 1: Configurar next.config.ts

Primero, verificar que `next.config.ts` tenga la config correcta para static export:

```typescript
// next.config.ts
const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

## Paso 2: Build de Producción

```bash
# Genera archivos estáticos en carpeta 'out/'
npm run build
```

Esto genera la carpeta `out/` con HTML, CSS, JS e imágenes estáticas.

**Nota**: Si tenés API routes, no funcionará en S3 estático. Necesitás usar un servicio externo (Formspree, Resend, etc.) o cambiar a Docker/Lambda.

## Paso 3: Deploy a S3

```bash
# Subir archivos al bucket S3
aws s3 sync out/ s3://aws1-hoggax-careers-hub --delete --acl public-read
```

| Flag | Qué hace |
|------|---------|
| `sync` | Sube solo archivos distintos (más rápido) |
| `--delete` | Borra archivos que ya no existen en `out/` |
| `--acl public-read` | Setea permisos públicos |

## Paso 4: Configurar CloudFront (opcional pero recomienda)

1. Ir a [CloudFront](https://console.aws.amazon.com/cloudfront) > **Create Distribution**
2. **Origin Domain**: seleccionar el S3 bucket
3. Origin access: **Legacy access**
4. Viewer protocol policy: **Redirect HTTP to HTTPS**
5. Cache policy: **CachingOptimized**
6. Create

Después de crear, copiar el **Distribution Domain Name** (ej: `d1234567890.cloudfront.net`)

## Paso 5: Configurar DNS

Configurar en Cloudflare:

| Tipo | Nombre | Valor |
|------|--------|-------|
| CNAME | portalempleo | d1234567890.cloudfront.net |

O si usas S3 directo (sin CloudFront):

| Tipo | Nombre | Valor |
|------|--------|-------|
| CNAME | portalempleo | aws1-hoggax-careers-hub.s3-website-us-east-1.amazonaws.com |

## Paso 6: SSL/TLS

Cloudflare provee SSL automático. Asegurar que:
- **SSL/TLS mode**: "Full" o "Flexible"
- **Always Use HTTPS**: Enabled

## Verificación Post-Deploy

```bash
# Verificar que responde
curl -I https://portalempleo.hoggax.com

# Verificar SEO tags
curl -s https://portalempleo.hoggax.com | grep -E '<title>|<meta name="description"|og:|twitter:'
```

## Rollback

```bash
# Subir versión anterior desde out/
aws s3 sync out/ s3://aws1-hoggax-careers-hub --delete --acl public-read

# O si usás GitHub con versiones:
# git checkout v0.9.0
# npm run build
# aws s3 sync out/ s3://aws1-hoggax-careers-hub --delete --acl public-read
```

## Health Check

- S3 Website Endpoint: `http://aws1-hoggax-careers-hub.s3-website-us-east-1.amazonaws.com`
- CloudFront: `https://d1234567890.cloudfront.net`

---

## Checklist Pre-Deploy

- [ ] Bucket S3 creado en us-east-1
- [ ] Bucket Policy configurada (permiso público de lectura)
- [ ] Static website hosting habilitado
- [ ] next.config.ts con `output: "export"`
- [ ] Build sin errores: `npm run build`
- [ ] Carpeta `out/` generada
- [ ] DNS configurado en Cloudflare
- [ ] SSL habilitado en Cloudflare

## Deploy Automatizado con GitHub Actions (opcional)

Crear `.github/workflows/deploy.yml`:

```yaml
name: Deploy to S3

on:
  push:
    branches: [master]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        
      - name: Deploy to S3
        uses: jakejarvis/s3-sync-action@master
        with:
          args: --delete --acl public-read
        env:
          AWS_S3_BUCKET: ${{ secrets.AWS_S3_BUCKET }}
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```

Agregar secrets en GitHub:
- `AWS_S3_BUCKET`: `aws1-hoggax-careers-hub`
- `AWS_ACCESS_KEY_ID`: tu access key de IAM
- `AWS_SECRET_ACCESS_KEY`: tu secret key

---

## Configurar Formulario (Lambda + n8n)

El formulario de postulaciones usa una Lambda para recibir los datos y enviarse a n8n.

### 1. Crear webhook en n8n

1. Ir a tu n8n > **Workflows** > **New**
2. Agregar nodo **Webhook** (trigger)
3. Copiar la URL del webhook

### 2. Crear Lambda en AWS

Ver documento completo: [lambda-form-handler.md](lambda-form-handler.md)

Pasos resumidos:

1. **Lambda** > Create function
   - Name: `hoggax-form-handler`
   - Runtime: `Node.js 20.x`

2. **Function URL** > Enable
   - Auth type: `NONE`

3. Actualizar código con webhook de n8n

### 3. Actualizar FormSection.tsx

En `src/components/FormSection.tsx` línea 26, reemplazar:

```typescript
// Antes (placeholder):
const LAMBDA_URL = "https://TU-LAMBDA-FUNCTION-URL.execute-api.us-east-1.amazonaws.com";

// Después (tu URL real):
const LAMBDA_URL = "https://xxxxx.execute-api.us-east-1.amazonaws.com/2015-03-31/functions/hoggax-form-handler/invocations";
```

### 4. Rebuild y redeploy

```bash
npm run build
aws s3 sync out/ s3://aws1-hoggax-careers-hub --delete --acl public-read
```

### Checklist Formulario

- [ ] Webhook de n8n creado
- [ ] Lambda creada con Function URL
- [ ] Código de Lambda actualizado con webhook URL
- [ ] FormSection.tsx actualizado con Lambda URL
- [ ] Build exitoso
- [ ] Deploy a S3
- [ ] Probar formulario