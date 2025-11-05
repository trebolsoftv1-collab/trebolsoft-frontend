import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getAuthHeaders = (token) => ({
  headers: { Authorization: `Bearer ${token}` }
});

export const getClients = async (token) => {
  const response = await axios.get(`${API_URL}/api/v1/clients`, getAuthHeaders(token));
  return response.data;
};

export const getClient = async (id, token) => {
  const response = await axios.get(`${API_URL}/api/v1/clients/${id}`, getAuthHeaders(token));
  return response.data;
};

export const createClient = async (clientData, token) => {
  const response = await axios.post(`${API_URL}/api/v1/clients`, clientData, getAuthHeaders(token));
  return response.data;
};

export const updateClient = async (id, clientData, token) => {
  const response = await axios.put(`${API_URL}/api/v1/clients/${id}`, clientData, getAuthHeaders(token));
  return response.data;
};

export const uploadPhoto = async (clientId, file, token) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await axios.post(
    `${API_URL}/api/v1/clients/${clientId}/photo`,
    formData,
    {
      ...getAuthHeaders(token),
      headers: {
        ...getAuthHeaders(token).headers,
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};