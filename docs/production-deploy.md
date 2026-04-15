# Deploy a Producción - portalempleo.hoggax.com

## URLs

- **Producción**: https://portalempleo.hoggax.com
- **Staging**: (pending)

## Requisitos Previos

- [ ] Docker y Docker Compose instalados
- [ ] Acceso al repositorio
- [ ] Credenciales de registry (si usa registry privado)

## Paso 1: Build de Producción

```bash
cd hoggax-careers-hub
make build
```

Esto genera la imagen Docker `hoggax-careers-hub-prod:latest`.

## Paso 2: Deploy

### Opción A: Docker Compose (local/server)

```bash
make prod
```

### Opción B: Push a Registry + Deploy

```bash
# Taggear imagen
docker tag hoggax-careers-hub-prod:latest registry.hoggax.com/hoggax-careers-hub:v1.0.0

# Push al registry
docker push registry.hoggax.com/hoggax-careers-hub:v1.0.0

# En el server de producción
docker pull registry.hoggax.com/hoggax-careers-hub:v1.0.0
docker run -d -p 3000:3000 --name hoggax-careers-hub registry.hoggax.com/hoggax-careers-hub:v1.0.0
```

## Paso 3: Configuración DNS

Configurar en Cloudflare:

| Tipo | Nombre | Valor |
|------|--------|-------|
| CNAME | portalempleo | @ o tu load balancer |

## Paso 4: SSL/TLS

Cloudflare provee SSL automático. Asegurar que:
- **SSL/TLS mode**: "Full" o "Flexible"
- **Always Use HTTPS**: Enabled

## Configuración de Variables de Entorno

Si necesitas variables de entorno customizadas:

```bash
# En docker-compose.yml o al ejecutar
docker run -e WEBHOOK_URL="https://..." -e OTRA_VAR="valor" ...
```

## Verificación Post-Deploy

```bash
# Verificar que responde
curl -I https://portalempleo.hoggax.com

# Verificar SEO tags
curl -s https://portalempleo.hoggax.com | grep -E '<title>|<meta name="description"|og:|twitter:'
```

## Rollback

```bash
# Si algo sale mal
docker ps -a  # encontrar versión anterior
docker tag hoggax-careers-hub-prod:v0.9.0 hoggax-careers-hub-prod:latest
make prod
```

## Health Check

Endpoint de health: `GET /` (retorna 200 si todo ok)

---

## Checklist Pre-Deploy

- [ ] Favicon configurado en `src/app/favicon.ico`
- [ ] Metadata SEO completa en `src/app/layout.tsx`
- [ ] OG Image en `src/app/opengraph-image.png` (1200x630px) - opcional
- [ ] Twitter Image en `src/app/twitter-image.png` (1200x630px) - opcional
- [ ] Build sin errores: `make build`
- [ ] Tests pasan (si hay)
- [ ] DNS configurado
- [ ] SSL habilitado en Cloudflare