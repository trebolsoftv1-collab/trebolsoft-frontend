<!-- sync-forced-2025 -->
# 🔄 SINCRONIZACIÓN COMPLETA TREBOLSOFT - Frontend

## 📋 **INFORMACIÓN DEL REPOSITORIO**

### **🎯 PROYECTO:** TrebolSoft Frontend
### **📅 ÚLTIMA SINCRONIZACIÓN:** 6 de noviembre de 2025
### **👨‍💻 DESARROLLADOR:** jpancha (GitHub: trebolsoftv1-collab)

---

## 🏗️ **CONFIGURACIÓN ACTUAL**

### **TECNOLOGÍAS:**
```
⚡ Vite 5.4.10 (build tool)
⚛️ React 19 (framework)
🎨 Tailwind CSS (estilos)
📡 Axios (HTTP requests)
🍞 React Hot Toast (notificaciones)
🧭 React Router DOM (navegación)
```

### **DEPLOYMENT:**
```
🌐 Dominio: https://app.trebolsoft.com
🚀 Hosting: Vercel
🔄 Auto-deploy: main branch
📦 Build: npm run build
📁 Output: dist/
```

### **BACKEND INTEGRATION:**
```
🔗 API URL: https://trebolsoftv1-latest.onrender.com
🔐 Autenticación: JWT tokens
🌐 CORS: Configurado para app.trebolsoft.com
```

---

## 📂 **ESTRUCTURA DEL PROYECTO**

```
trebolsoft-frontend/
├── public/                     # Archivos estáticos
├── src/
│   ├── components/            # Componentes React
│   │   ├── Layout.jsx        # Navbar + Sidebar
│   │   ├── UserForm.jsx      # Gestión de usuarios
│   │   ├── ClientForm.jsx    # Gestión de clientes
│   │   └── [otros componentes]
│   ├── pages/                # Vistas principales
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   └── Clients.jsx
│   ├── services/             # Servicios API
│   │   └── api.js           # Configuración Axios
│   ├── App.jsx              # Routing principal
│   └── main.jsx             # Punto de entrada
├── package.json             # Dependencias
├── vite.config.js          # Configuración Vite
├── tailwind.config.js      # Configuración Tailwind
└── vercel.json             # Configuración deployment
```

---

## 🔐 **SISTEMA DE AUTENTICACIÓN**

### **FLUJO IMPLEMENTADO:**
```javascript
// Login
POST /api/v1/auth/login
- Recibe: { email, password }
- Devuelve: { access_token, user_info }

// Token storage
localStorage.setItem('token', access_token)

// API requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
```

### **PROTECCIÓN DE RUTAS:**
```javascript
// Verificación de autenticación
const isAuthenticated = localStorage.getItem('token') !== null

// Redirección automática
if (!isAuthenticated) {
  navigate('/login')
}
```

---

## 👥 **SISTEMA DE ROLES - FRONTEND**

### **COMPONENTES POR ROL:**
```javascript
// Admin: Ve todo
- UsersList (crear supervisores y cobradores)
- ClientsList (todos los clientes)
- Dashboard completo

// Supervisor: Ve su zona
- UsersList (solo crear cobradores)
- ClientsList (zona + cobradores asignados)
- Dashboard regional

// Cobrador: Ve sus asignaciones
- ClientsList (solo sus clientes)
- Dashboard personal
```

### **CONDITIONAL RENDERING:**
```javascript
// Ejemplo en UserForm.jsx
{user.role === 'admin' && (
  <option value="supervisor">Supervisor</option>
)}

{user.role !== 'collector' && (
  <option value="collector">Cobrador</option>
)}
```

---

## 🏠 **GESTIÓN DE CLIENTES**

### **FUNCIONALIDADES IMPLEMENTADAS:**
```javascript
✅ CRUD completo de clientes
✅ Subida de fotos (profile_photo, house_photo)
✅ Geolocalización (latitude, longitude)
✅ Asignación automática por rol
✅ Validación de formularios
✅ Búsqueda y filtrado
```

### **INTEGRACIÓN CON CLOUDINARY:**
```javascript
// Upload de imágenes
const uploadImage = async (file, type) => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', 'trebolsoft')
  
  // Upload a Cloudinary
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData
  })
  
  return response.json().secure_url
}
```

---

## 📱 **INTERFAZ DE USUARIO**

### **DISEÑO ACTUAL:**
```
🎨 Tema: Profesional con colores corporativos
📱 Responsive: Mobile-first design
🧭 Navegación: Sidebar colapsible
🍞 Notificaciones: Toast messages
📊 Tablas: Paginadas y ordenables
```

### **COMPONENTES PRINCIPALES:**
```javascript
- Layout.jsx: Estructura base
- Navbar.jsx: Navegación superior  
- Sidebar.jsx: Menú lateral
- DataTable.jsx: Tablas de datos
- FormInput.jsx: Inputs reutilizables
- LoadingSpinner.jsx: Indicadores de carga
```

---

## 🔄 **ESTADOS DE DESARROLLO**

### **✅ COMPLETADO:**
- ✅ Sistema de login funcional
- ✅ Dashboard principal implementado
- ✅ CRUD de usuarios con roles
- ✅ CRUD de clientes con fotos
- ✅ Navegación por roles
- ✅ Responsive design
- ✅ Deployment automático
- ✅ Integración con backend

### **🔄 EN PROCESO:**
- 🔄 Optimización de performance
- 🔄 Mejoras de UX/UI
- 🔄 Validaciones avanzadas

### **📋 PENDIENTE:**
- 📋 Sistema de pagos y créditos
- 📋 Reportes y dashboards avanzados
- 📋 Notificaciones en tiempo real
- 📋 Modo offline

---

## 🚀 **COMANDOS DE DESARROLLO**

### **INSTALACIÓN:**
```bash
npm install
```

### **DESARROLLO:**
```bash
npm run dev
# Servidor: http://localhost:5173
```

### **BUILD:**
```bash
npm run build
# Output: dist/
```

### **PREVIEW:**
```bash
npm run preview
# Preview de build
```

---

## 🔗 **INTEGRACIÓN CON BACKEND**

### **REPOSITORIO RELACIONADO:**
```
📁 Backend: https://github.com/trebolsoftv1-collab/TrebolsoftV1
🔗 API: https://trebolsoftv1-latest.onrender.com
📚 Docs: TrebolsoftV1/PROJECT_CONTEXT_FULL.md
```

### **ENDPOINTS UTILIZADOS:**
```javascript
// Autenticación
POST /api/v1/auth/login
POST /api/v1/auth/register

// Usuarios
GET /api/v1/users/
POST /api/v1/users/
PUT /api/v1/users/{id}
DELETE /api/v1/users/{id}

// Clientes
GET /api/v1/clients/
POST /api/v1/clients/
PUT /api/v1/clients/{id}
DELETE /api/v1/clients/{id}
```

---

## 📦 **DEPENDENCIAS PRINCIPALES**

```json
{
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "react-router-dom": "^6.x",
  "axios": "^1.x",
  "react-hot-toast": "^2.x",
  "tailwindcss": "^3.x",
  "vite": "^5.4.10"
}
```

---

## 🛡️ **CONFIGURACIÓN DE SEGURIDAD**

### **VARIABLES DE ENTORNO:**
```bash
# .env (no incluido en repo)
VITE_API_URL=https://trebolsoftv1-latest.onrender.com
VITE_CLOUDINARY_CLOUD_NAME=tu_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=trebolsoft
```

### **CORS Y HEADERS:**
```javascript
// api.js
axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Interceptor para token
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

---

## 🔄 **SINCRONIZACIÓN CON BACKEND**

### **ESTADO ACTUAL:**
```
✅ Frontend y backend completamente sincronizados
✅ Deployment automático funcionando
✅ CORS configurado correctamente
✅ Autenticación integrada
✅ Roles y permisos alineados
```

### **PARA MANTENER SINCRONIZACIÓN:**
```bash
# 1. Verificar cambios en backend
git log --oneline -5

# 2. Actualizar frontend si es necesario
npm run build
git add .
git commit -m "Sync con backend"
git push

# 3. Verificar deployment
# Frontend: https://app.trebolsoft.com
# Backend: https://trebolsoftv1-latest.onrender.com/health
```

---

## 📞 **INFORMACIÓN DE CONTACTO**

### **REPOSITORIOS:**
- **Frontend**: https://github.com/trebolsoftv1-collab/trebolsoft-frontend
- **Backend**: https://github.com/trebolsoftv1-collab/TrebolsoftV1

### **DEPLOYMENTS:**
- **Frontend**: https://app.trebolsoft.com
- **Backend**: https://trebolsoftv1-latest.onrender.com

---

**🎯 ESTE ARCHIVO MANTIENE LA SINCRONIZACIÓN ENTRE FRONTEND Y BACKEND**