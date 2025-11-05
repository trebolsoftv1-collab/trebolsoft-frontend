import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import * as clientsAPI from '../../api/endpoints/clients';

export default function ClientList() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      setLoading(true);
      const data = await clientsAPI.getClients();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      setError('Error al cargar clientes');
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.dni?.includes(searchTerm) ||
    client.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigate('/dashboard')}
                className='text-gray-600 hover:text-gray-900'
              >
                 Volver
              </button>
              <h1 className='text-2xl font-bold text-gray-900'>Clientes</h1>
            </div>
            <button
              onClick={handleLogout}
              className='bg-danger-600 text-white px-4 py-2 rounded-lg hover:bg-danger-700 transition'
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Actions Bar */}
        <div className='mb-6 flex flex-col sm:flex-row gap-4 justify-between'>
          <input
            type='text'
            placeholder='Buscar por nombre, DNI o dirección...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent flex-1 max-w-md'
          />
          {(user?.role === 'admin' || user?.role === 'supervisor') && (
            <button
              onClick={() => navigate('/clients/new')}
              className='bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition'
            >
              + Nuevo Cliente
            </button>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className='mb-6 bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded-lg'>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className='text-center py-12'>
            <div className='inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent'></div>
            <p className='mt-4 text-gray-600'>Cargando clientes...</p>
          </div>
        )}

        {/* Client List */}
        {!loading && (
          <div className='bg-white rounded-lg shadow overflow-hidden'>
            {filteredClients.length === 0 ? (
              <div className='text-center py-12'>
                <p className='text-gray-500 text-lg'>No se encontraron clientes</p>
              </div>
            ) : (
              <div className='overflow-x-auto'>
                <table className='min-w-full divide-y divide-gray-200'>
                  <thead className='bg-gray-50'>
                    <tr>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        DNI
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Nombre
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Dirección
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Teléfono
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Ubicación
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Foto
                      </th>
                      <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className='bg-white divide-y divide-gray-200'>
                    {filteredClients.map((client) => (
                      <tr key={client.id} className='hover:bg-gray-50'>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                          {client.dni}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                          {client.full_name}
                        </td>
                        <td className='px-6 py-4 text-sm text-gray-600'>
                          {client.address}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                          {client.phone || '-'}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                          {client.latitude && client.longitude ? (
                            <a
                              href={client.google_maps_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary-600 hover:text-primary-800 flex items-center gap-1'
                            >
                               Ver mapa
                            </a>
                          ) : (
                            <span className='text-gray-400'>Sin ubicación</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                          {client.house_photo_url ? (
                            <a
                              href={client.house_photo_url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='text-primary-600 hover:text-primary-800 flex items-center gap-1'
                            >
                               Ver foto
                            </a>
                          ) : (
                            <span className='text-gray-400'>Sin foto</span>
                          )}
                        </td>
                        <td className='px-6 py-4 whitespace-nowrap text-sm'>
                          {(user?.role === 'admin' || user?.role === 'supervisor') && (
                            <button
                              onClick={() => navigate(`/clients/${client.id}`)}
                              className='text-secondary-600 hover:text-secondary-800 font-medium'
                            >
                              Editar
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {!loading && filteredClients.length > 0 && (
          <div className='mt-4 text-sm text-gray-600 text-center'>
            Mostrando {filteredClients.length} de {clients.length} clientes
          </div>
        )}
      </main>
    </div>
  );
}


