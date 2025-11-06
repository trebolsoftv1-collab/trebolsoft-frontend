import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Obtener token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getUsers = async () => {
  const response = await axios.get(`${API_URL}/api/v1/users/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/v1/users/`, userData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getUser = async (userId) => {
  const response = await axios.get(`${API_URL}/api/v1/users/${userId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`${API_URL}/api/v1/users/${userId}`, userData, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/api/v1/users/${userId}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};