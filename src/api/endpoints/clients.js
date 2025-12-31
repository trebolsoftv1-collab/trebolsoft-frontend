// sync-forced-2025
import api from '../axios';

export const getClients = async () => {
  const response = await api.get('/api/v1/clients/');
  return response.data;
};

export const getClient = async (id) => {
  const response = await api.get(`/api/v1/clients/${id}`);
  return response.data;
};

export const createClient = async (clientData, photoFile = null) => {
  try {
    // Crear cliente primero
    const response = await api.post('/api/v1/clients/', clientData);
    
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
    const response = await api.put(`/api/v1/clients/${id}`, clientData);
    
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

  const response = await api.post(
    `/api/v1/clients/${clientId}/photo`,
    formData,
    {
      headers: {
        'Content-Type': undefined
      }
    }
  );
  return response.data;
};

export const deleteClient = async (id) => {
  const response = await api.delete(`/api/v1/clients/${id}`);
  return response.data;
};