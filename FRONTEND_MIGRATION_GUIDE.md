# 🔄 GUÍA DE MIGRACIÓN - TrebolSoft Frontend

## 📦 **MIGRACIÓN A NUEVA COMPUTADORA**

### **📋 CHECKLIST DE MIGRACIÓN:**

#### **PREPARACIÓN:**
- [ ] Node.js 18+ instalado
- [ ] Git configurado
- [ ] VS Code instalado
- [ ] Cuenta GitHub (trebolsoftv1-collab) configurada

#### **DESCARGA Y CONFIGURACIÓN:**
```bash
# 1. Clonar repositorio frontend
git clone https://github.com/trebolsoftv1-collab/trebolsoft-frontend.git
cd trebolsoft-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con valores reales

# 4. Verificar funcionamiento
npm run dev
# Debería abrir http://localhost:5173
```

#### **VERIFICACIÓN:**
- [ ] Frontend arranca sin errores
- [ ] Conexión con backend funciona
- [ ] Login funciona correctamente
- [ ] Navegación entre páginas operativa
- [ ] Subida de imágenes funciona

---

## 🔗 **CONEXIÓN CON BACKEND**

### **VERIFICAR INTEGRACIÓN:**
```bash
# Backend debe estar funcionando en:
# https://trebolsoftv1-latest.onrender.com

# Probar endpoints principales:
curl https://trebolsoftv1-latest.onrender.com/health
curl https://trebolsoftv1-latest.onrender.com/api/v1/auth/login
```

### **CONFIGURACIÓN DE API:**
```javascript
// src/services/api.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// Verificar que .env tenga:
VITE_API_URL=https://trebolsoftv1-latest.onrender.com
```

---

## 💬 **CONTEXTO PARA GITHUB COPILOT**

### **MENSAJE DE CONTINUIDAD:**
```
Hola GitHub Copilot,

Estoy continuando el trabajo en TrebolSoft Frontend desde una nueva computadora.

CONTEXTO:
- Proyecto: Frontend React para sistema de créditos TrebolSoft
- Stack: Vite + React 19 + Tailwind CSS
- Backend: FastAPI en https://trebolsoftv1-latest.onrender.com
- Deployment: Vercel en https://app.trebolsoft.com

ESTADO ACTUAL:
✅ Sistema completo de usuarios con roles
✅ CRUD de clientes con geolocalización y fotos
✅ Autenticación JWT integrada con backend
✅ Deployment automático funcionando
✅ Responsive design implementado

REPOSITORIOS RELACIONADOS:
- Frontend: trebolsoftv1-collab/trebolsoft-frontend
- Backend: trebolsoftv1-collab/TrebolsoftV1

¿Puedes revisar el archivo FRONTEND_SYNC_STATUS.md y confirmar que entiendes el estado actual del frontend?

Necesito continuar con [especificar tarea].
```

---

## 📁 **ARCHIVOS CRÍTICOS PARA MIGRACIÓN**

### **CONFIGURACIÓN:**
- [ ] `package.json` - Dependencias
- [ ] `vite.config.js` - Configuración build
- [ ] `tailwind.config.js` - Estilos
- [ ] `.env.example` - Variables de entorno
- [ ] `vercel.json` - Configuración deployment

### **CÓDIGO PRINCIPAL:**
- [ ] `src/App.jsx` - Routing principal
- [ ] `src/services/api.js` - Configuración API
- [ ] `src/components/Layout.jsx` - Estructura base
- [ ] `src/components/UserForm.jsx` - Gestión usuarios
- [ ] `src/components/ClientForm.jsx` - Gestión clientes

### **DOCUMENTACIÓN:**
- [ ] `FRONTEND_SYNC_STATUS.md` - Estado actual
- [ ] `FRONTEND_MIGRATION_GUIDE.md` - Esta guía
- [ ] `README.md` - Instrucciones básicas

---

## 🚀 **COMANDOS ESENCIALES**

### **DESARROLLO:**
```bash
# Instalar dependencias
npm install

# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### **DEPLOYMENT:**
```bash
# Automático con git push
git add .
git commit -m "descripción"
git push

# Vercel despliega automáticamente
# Verificar: https://app.trebolsoft.com
```

### **VERIFICACIÓN DE ESTADO:**
```bash
# Verificar dependencias
npm audit

# Verificar build
npm run build

# Verificar conexión con backend
curl https://trebolsoftv1-latest.onrender.com/health
```

---

## 🔧 **TROUBLESHOOTING COMÚN**

### **ERROR: "Cannot connect to API"**
```bash
# Verificar variables de entorno
cat .env

# Verificar que backend esté funcionando
curl https://trebolsoftv1-latest.onrender.com/health

# Verificar CORS en backend
```

### **ERROR: "Build fails"**
```bash
# Limpiar cache
npm run build --clean

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### **ERROR: "Login no funciona"**
```bash
# Verificar token en localStorage
localStorage.getItem('token')

# Verificar endpoint de login
curl -X POST https://trebolsoftv1-latest.onrender.com/api/v1/auth/login
```

---

## 📊 **ESTADO DE SINCRONIZACIÓN**

### **CON BACKEND:**
```
✅ Endpoints alineados
✅ Modelos de datos sincronizados
✅ Autenticación integrada
✅ CORS configurado
✅ Roles y permisos coordinados
```

### **CON DEPLOYMENT:**
```
✅ Vercel configurado
✅ Variables de entorno actualizadas
✅ Build automático funcionando
✅ Dominio personalizado activo
```

---

## ⚠️ **NOTAS IMPORTANTES**

### **VARIABLES DE ENTORNO:**
```bash
# NUNCA commitear .env con valores reales
# Usar .env.example como referencia
# Configurar variables en Vercel dashboard

VITE_API_URL=https://trebolsoftv1-latest.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=tu_valor
VITE_CLOUDINARY_UPLOAD_PRESET=trebolsoft
```

### **DEPENDENCIAS:**
```bash
# Mantener versiones estables
# Probar antes de actualizar major versions
# Verificar compatibilidad con Vite y React
```

---

**🎯 CON ESTA GUÍA, EL FRONTEND SE MIGRA COMPLETAMENTE SIN PERDER FUNCIONALIDAD**