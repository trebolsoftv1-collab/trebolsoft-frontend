import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const login = async (username, password) => { const formData = new FormData(); formData.append('username', username); formData.append('password', password);
  
  const response = await axios.post(`${API_URL}/api/v1/auth/token`, formData);
  return response.data;
};

export const getCurrentUser = async (token) => {
  const response = await axios.get(`${API_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data;
};
