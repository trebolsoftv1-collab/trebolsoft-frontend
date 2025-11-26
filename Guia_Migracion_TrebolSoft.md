# Guía de Migración y Proveedores para TrebolSoft
## Checklist de despliegue y operación Trebolsoft

1. [ ] Contratar y configurar VPS en DigitalOcean
	- [ ] Crear cuenta y contratar VPS adecuado
	- [ ] Configurar sistema operativo y acceso SSH

2. [ ] Configurar dominio y DNS en Namecheap y Cloudflare
	- [ ] Renovar dominio en Namecheap
	- [ ] Apuntar DNS a Cloudflare
	- [ ] Configurar registros DNS en Cloudflare para el VPS

3. [ ] Configurar seguridad y CDN en Cloudflare
	- [ ] Activar protección DDoS, SSL/TLS y reglas de firewall
	- [ ] Habilitar CDN para el dominio

4. [ ] Preparar el entorno del servidor (VPS)
	- [ ] Instalar dependencias básicas (Python, Docker, Git, etc.)
	- [ ] Clonar repositorio desde GitHub
	- [ ] Configurar variables de entorno y credenciales

5. [ ] Configurar almacenamiento de fotos en Cloudinary
	- [ ] Crear cuenta y obtener credenciales API
	- [ ] Integrar credenciales en el backend

6. [ ] Desplegar backend (FastAPI) y frontend
	- [ ] Configurar y levantar contenedores Docker (o entorno local)
	- [ ] Aplicar migraciones de base de datos
	- [ ] Verificar funcionamiento de endpoints y frontend

7. [ ] Configurar monitorización con UptimeRobot
	- [ ] Crear cuenta y agregar endpoints críticos (API, frontend, /health)
	- [ ] Configurar alertas por correo o Telegram

8. [ ] Pruebas finales y checklist
	- [ ] Verificar acceso desde dominio público
	- [ ] Probar subida de fotos y funcionalidades principales
	- [ ] Validar monitorización y alertas

## Recomendación Final

- **VPS:** DigitalOcean (São Paulo)
- **CDN:** Cloudflare (frontend y API)

---

## 1. Checklist de Migración

### VPS DigitalOcean (São Paulo)
- Contratar Droplet (VPS) con Ubuntu 22.04 LTS
- Specs recomendadas: 2 vCPU, 2-4 GB RAM, 40+ GB SSD
- Configurar IP pública y acceso SSH seguro
- Instalar Docker y Docker Compose
- Configurar firewall (solo puertos 80, 443, 10000)

### Backend (API FastAPI)
- Subir código y archivos al VPS
- Configurar variables de entorno (.env)
- Ejecutar Docker Compose para levantar API y DB
- Configurar backups automáticos de la base de datos
- Instalar y configurar certificados SSL (Let's Encrypt)

### Frontend (React)
- Ejecutar `npm run build` y subir carpeta `dist/` al VPS
- Instalar y configurar Nginx para servir archivos estáticos
- Redirigir tráfico HTTP a HTTPS

### Cloudflare (CDN)
- Apuntar DNS del dominio a Cloudflare
- Activar proxy y caché para frontend
- Configurar reglas para proteger la API
- Habilitar SSL flexible o completo

### Cloudinary
- Verificar credenciales en `.env` para subida de fotos

### Seguridad y Monitorización
- Configurar backups automáticos
- Monitorización básica (UptimeRobot, Grafana, etc.)
- Logs centralizados (opcional)

---

## 2. Proveedores y Costos Aproximados

| Servicio      | Proveedor      | Costo mensual | Notas                       |
|--------------|---------------|---------------|-----------------------------|
| VPS          | DigitalOcean   | $6-12 USD     | Datacenter São Paulo        |
| CDN          | Cloudflare     | Gratis/Económico | Frontend y API             |
| Dominio      | (ya tienes)    | -             | Usar con Cloudflare         |
| Cloudinary   | Cloudinary     | Gratis/Económico | Fotos, escalable           |
| Backups      | DigitalOcean   | $2-5 USD      | Opcional, snapshots         |

---

## 3. Pasos para Despliegue

1. Contrata y configura el VPS en DigitalOcean (São Paulo)
2. Apunta el dominio a Cloudflare y configura DNS
3. Instala Docker y Docker Compose en el VPS
4. Sube el backend y frontend al VPS
5. Configura y ejecuta Docker Compose para la API y DB
6. Instala Nginx y sirve el frontend
7. Configura SSL con Let's Encrypt
8. Verifica integración con Cloudinary
9. Activa backups y monitorización

---

## 4. Recursos Útiles
- [DigitalOcean Docs](https://docs.digitalocean.com/)
- [Cloudflare Docs](https://developers.cloudflare.com/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Nginx](https://nginx.org/en/docs/)

---
apt update && apt upgrade -y
**Fecha:** 10 de noviembre de 2025
**Autor:** GitHub Copilot
