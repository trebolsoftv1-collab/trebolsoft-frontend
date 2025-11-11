import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:10000';

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
    // Por ahora, NO manejar 401 aquí para poder debuggear
    // Dejamos que los componentes vean el error completo
    return Promise.reject(error);
  }
);

export default api;
export { API_URL };
