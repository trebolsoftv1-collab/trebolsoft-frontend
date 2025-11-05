import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import * as clientsAPI from '../../api/endpoints/clients';
import ClientLocationPhoto from '../../components/ClientLocationPhoto';

export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { logout } = useAuthStore();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    dni: '',
    full_name: '',
    address: '',
    phone: '',
    email: '',
    latitude: null,
    longitude: null,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingClient, setLoadingClient] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      loadClient();
    }
  }, [id]);

  const loadClient = async () => {
    try {
      setLoadingClient(true);
      const data = await clientsAPI.getClient(id);
      setFormData({
        dni: data.dni,
        full_name: data.full_name,
        address: data.address,
        phone: data.phone || '',
        email: data.email || '',
        latitude: data.latitude,
        longitude: data.longitude,
      });
      setPhotoPreview(data.house_photo_url || '');
    } catch (err) {
      console.error('Error loading client:', err);
      setError('Error al cargar cliente');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoadingClient(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationCapture = (location) => {
    setFormData({
      ...formData,
      latitude: location.latitude,
      longitude: location.longitude,
    });
  };

  const handlePhotoSelect = (file, preview) => {
    setPhotoFile(file);
    setPhotoPreview(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      let clientId = id;

      // Crear o actualizar cliente
      if (isEdit) {
        await clientsAPI.updateClient(id, formData);
        setSuccess('Cliente actualizado correctamente');
      } else {
        const newClient = await clientsAPI.createClient(formData);
        clientId = newClient.id;
        setSuccess('Cliente creado correctamente');
      }

      // Si hay foto, subirla
      if (photoFile && clientId) {
        await clientsAPI.uploadPhoto(clientId, photoFile);
      }

      // Redirigir a la lista después de 1.5 segundos
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
    } catch (err) {
      console.error('Error saving client:', err);
      setError(err.response?.data?.detail || 'Error al guardar cliente');
    } finally {
      setLoading(false);
    }
  };

  if (loadingClient) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='text-center'>
          <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent'></div>
          <p className='mt-4 text-gray-600'>Cargando cliente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigate('/clients')}
                className='text-gray-600 hover:text-gray-900'
              >
                 Volver
              </button>
              <h1 className='text-2xl font-bold text-gray-900'>
                {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='bg-white rounded-lg shadow p-6'>
          {/* Success Alert */}
          {success && (
            <div className='mb-6 bg-primary-50 border border-primary-200 text-primary-700 px-4 py-3 rounded-lg'>
              {success}
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className='mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='space-y-6'>
            {/* DNI */}
            <div>
              <label htmlFor='dni' className='block text-sm font-medium text-gray-700 mb-2'>
                DNI *
              </label>
              <input
                id='dni'
                name='dni'
                type='text'
                required
                value={formData.dni}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                placeholder='12345678'
                disabled={loading}
              />
            </div>

            {/* Nombre Completo */}
            <div>
              <label htmlFor='full_name' className='block text-sm font-medium text-gray-700 mb-2'>
                Nombre Completo *
              </label>
              <input
                id='full_name'
                name='full_name'
                type='text'
                required
                value={formData.full_name}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                placeholder='Juan Pérez'
                disabled={loading}
              />
            </div>

            {/* Dirección */}
            <div>
              <label htmlFor='address' className='block text-sm font-medium text-gray-700 mb-2'>
                Dirección *
              </label>
              <input
                id='address'
                name='address'
                type='text'
                required
                value={formData.address}
                onChange={handleChange}
                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                placeholder='Av. Principal 123'
                disabled={loading}
              />
            </div>

            {/* Teléfono y Email */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
              <div>
                <label htmlFor='phone' className='block text-sm font-medium text-gray-700 mb-2'>
                  Teléfono
                </label>
                <input
                  id='phone'
                  name='phone'
                  type='tel'
                  value={formData.phone}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  placeholder='987654321'
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor='email' className='block text-sm font-medium text-gray-700 mb-2'>
                  Email
                </label>
                <input
                  id='email'
                  name='email'
                  type='email'
                  value={formData.email}
                  onChange={handleChange}
                  className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                  placeholder='cliente@example.com'
                  disabled={loading}
                />
              </div>
            </div>

            {/* Ubicación y Foto */}
            <div>
              <h3 className='text-lg font-medium text-gray-900 mb-4'>Ubicación y Foto de Vivienda</h3>
              <ClientLocationPhoto
                latitude={formData.latitude}
                longitude={formData.longitude}
                photoPreview={photoPreview}
                onLocationCapture={handleLocationCapture}
                onPhotoSelect={handlePhotoSelect}
              />
            </div>

            {/* Buttons */}
            <div className='flex gap-4 pt-4'>
              <button
                type='button'
                onClick={() => navigate('/clients')}
                className='flex-1 bg-gray-200 text-gray-700 py-2.5 rounded-lg font-medium hover:bg-gray-300 transition'
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type='submit'
                disabled={loading}
                className='flex-1 bg-primary-600 text-white py-2.5 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-4 focus:ring-primary-300 transition disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? 'Guardando...' : isEdit ? 'Actualizar Cliente' : 'Crear Cliente'}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
