// sync-forced-2025
import axios from 'axios';

// La URL base ahora apunta a la ruta correcta con el versionado de la API.
// En desarrollo, el proxy de Vite lo interceptará.
// En producción, el servidor web (Nginx) lo redirigirá.
const API_URL = '/api/v1';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Si el Content-Type es undefined (FormData), dejarlo para que el navegador lo establezca
    if (config.headers['Content-Type'] === undefined) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si recibimos un 401 (No autorizado), podríamos redirigir al login.
    if (error.response && error.response.status === 401) {
      // localStorage.removeItem('access_token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
