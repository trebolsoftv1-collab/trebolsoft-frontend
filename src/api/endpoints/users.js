import api from '../axios';

export const getUsers = async () => {
  const response = await api.get('/api/v1/users/');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/api/v1/users/', userData);
  return response.data;
};

export const getUser = async (userId) => {
  const response = await api.get(`/api/v1/users/${userId}`);
  return response.data;
};

export const getMe = async () => {
  const response = await api.get('/api/v1/users/me');
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await api.put(`/api/v1/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  const response = await api.delete(`/api/v1/users/${userId}`);
  return response.data;
};