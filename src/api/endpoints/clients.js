import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Obtener token del localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getClients = async () => {
  const response = await axios.get(`${API_URL}/api/v1/clients/`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const getClient = async (id) => {
  const response = await axios.get(`${API_URL}/api/v1/clients/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};

export const createClient = async (clientData, photoFile = null) => {
  try {
    // Crear cliente primero
    const response = await axios.post(`${API_URL}/api/v1/clients/`, clientData, {
      headers: getAuthHeaders()
    });
    
    const newClient = response.data;
    
    // Si hay foto, subirla después
    if (photoFile) {
      await uploadPhoto(newClient.id, photoFile);
    }
    
    return newClient;
  } catch (error) {
    console.error('Error creating client:', error);
    throw error;
  }
};

export const updateClient = async (id, clientData, photoFile = null) => {
  try {
    // Actualizar cliente primero
    const response = await axios.put(`${API_URL}/api/v1/clients/${id}`, clientData, {
      headers: getAuthHeaders()
    });
    
    const updatedClient = response.data;
    
    // Si hay foto nueva, subirla
    if (photoFile) {
      await uploadPhoto(id, photoFile);
    }
    
    return updatedClient;
  } catch (error) {
    console.error('Error updating client:', error);
    throw error;
  }
};

export const uploadPhoto = async (clientId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(
    `${API_URL}/api/v1/clients/${clientId}/photo`,
    formData,
    {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data'
      }
    }
  );
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await axios.delete(`${API_URL}/api/v1/clients/${id}`, {
    headers: getAuthHeaders()
  });
  return response.data;
};