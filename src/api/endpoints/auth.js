// sync-forced-2025
import api from '../axios';

export const login = async (username, password) => {
  const formData = new FormData();
  formData.append('username', username);
  formData.append('password', password);
  
  const response = await api.post('/api/v1/auth/token', formData, {
    headers: {
      'Content-Type': undefined, // Deja que el navegador establezca el Content-Type con boundary
    },
  });
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/v1/auth/me');
  return response.data;
};
