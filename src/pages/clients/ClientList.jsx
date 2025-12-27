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
      setError(''); // Limpiar error si fue exitoso
    } catch (err) {
      console.error('Error loading clients:', err);
      console.error('Error response:', err.response?.data);
      console.error('Error status:', err.response?.status);
      
      // Mostrar el mensaje de error específico del backend
      const errorMsg = err.response?.data?.detail || err.response?.data?.message || 'Error al cargar clientes';
      setError(`${errorMsg} (Status: ${err.response?.status || 'unknown'})`);
      
      // NO cerrar sesión automáticamente para poder ver el error
      // if (err.response?.status === 401) {
      //   logout();
      //   navigate('/login');
      // }
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(client =>
    client.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.dni?.includes(searchTerm) ||
    client.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone?.includes(searchTerm)
  );

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const canEditClient = () => {
    return user?.role === 'ADMIN' || user?.role === 'SUPERVISOR';
  };

  const canDeleteClient = () => {
    return user?.role === 'ADMIN';
  };

  const getGoogleMapsUrl = (latitude, longitude) => {
    if (latitude && longitude) {
      return `https://maps.google.com/?q=${latitude},${longitude}`;
    }
    return null;
  };

  const getRoleLabel = (role) => {
    const labels = {
      ADMIN: 'Administrador',
      SUPERVISOR: 'Supervisor', 
      COLLECTOR: 'Cobrador'
    };
    return labels[role] || role;
  };

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <header className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>Clientes</h1>
              <p className='text-sm text-gray-600 mt-1'>
                {user?.full_name || user?.username} - {getRoleLabel(user?.role)}
              </p>
            </div>
            <div className='flex items-center gap-4'>
              <button
                onClick={() => navigate('/dashboard')}
                className='text-gray-600 hover:text-gray-900'
              >
                ← Dashboard
              </button>
              <button
                onClick={handleLogout}
                className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition'
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Controls */}
        <div className='mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
          <div className='flex-1 max-w-md'>
            <input
              type='text'
              placeholder='Buscar por nombre, DNI, ciudad, dirección o teléfono...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <button
            onClick={() => navigate('/clients/new')}
            className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
            disabled={!(user?.role === 'ADMIN' || user?.role === 'SUPERVISOR' || user?.role === 'COLLECTOR')}
          >
            + Nuevo Cliente
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className='mb-4 bg-red-50 border border-red-200 rounded-md p-4'>
            <p className='text-red-600'>{error}</p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className='flex justify-center items-center h-64'>
            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600'></div>
          </div>
        )}

        {/* Clients Table */}
        {!loading && (
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <div className='overflow-x-auto'>
              <table className='min-w-full divide-y divide-gray-200'>
                <thead className='bg-gray-50'>
                  <tr>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Cliente
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Contacto
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Ubicación
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Cobrador
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Estado
                    </th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                  {filteredClients.map((client) => (
                    <tr key={client.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='flex items-center'>
                          <div className='flex-shrink-0 h-10 w-10'>
                            {client.house_photo_url ? (
                              <img 
                                className='h-10 w-10 rounded-full object-cover'
                                src={client.house_photo_url}
                                alt='Foto vivienda'
                              />
                            ) : (
                              <div className='h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center'>
                                <span className='text-gray-600 text-xs'>🏠</span>
                              </div>
                            )}
                          </div>
                          <div className='ml-4'>
                            <div className='text-sm font-medium text-gray-900'>
                              {client.full_name}
                            </div>
                            <div className='text-sm text-gray-500'>
                              DNI: {client.dni}
                            </div>
                          </div>
                        </div>
                      </td>
                      
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          📱 {client.phone}
                        </div>
                        {client.phone2 && (
                          <div className='text-sm text-gray-500'>
                            📱 {client.phone2}
                          </div>
                        )}
                        {client.email && (
                          <div className='text-sm text-gray-500'>
                            ✉️ {client.email}
                          </div>
                        )}
                      </td>
                      
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <div className='text-sm text-gray-900'>
                          🏙️ {client.city}
                        </div>
                        <div className='text-sm text-gray-500'>
                          📍 {client.address}
                        </div>
                        {client.latitude && client.longitude && (
                          <a
                            href={getGoogleMapsUrl(client.latitude, client.longitude)}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-sm text-blue-600 hover:text-blue-900'
                          >
                            🗺️ Ver en Maps
                          </a>
                        )}
                      </td>
                      
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                        {client.collector ? (
                          <div>
                            <div className='font-medium'>{client.collector.full_name}</div>
                            <div className='text-gray-500'>{client.collector.zone}</div>
                          </div>
                        ) : (
                          <span className='text-gray-400'>Sin asignar</span>
                        )}
                      </td>
                      
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          client.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {client.is_active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      
                      <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                        <div className='flex space-x-2'>
                          <button
                            onClick={() => navigate(`/clients/${client.id}`)}
                            className='text-blue-600 hover:text-blue-900'
                          >
                            Ver
                          </button>
                          {canEditClient() && (
                            <button
                              onClick={() => navigate(`/clients/${client.id}/edit`)}
                              className='text-indigo-600 hover:text-indigo-900'
                            >
                              Editar
                            </button>
                          )}
                          {canDeleteClient() && (
                            <button
                              onClick={() => {/* lógica de eliminación aquí */}}
                              className='text-red-600 hover:text-red-900'
                            >
                              Eliminar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {filteredClients.length === 0 && !loading && (
              <div className='text-center py-12'>
                <div className='text-gray-400 text-6xl mb-4'>👥</div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>
                  {searchTerm ? 'No se encontraron clientes' : 'No hay clientes registrados'}
                </h3>
                <p className='text-gray-500'>
                  {searchTerm 
                    ? 'Intenta con otros términos de búsqueda'
                    : 'Comienza agregando tu primer cliente'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => navigate('/clients/new')}
                    className='mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
                  >
                    Crear Primer Cliente
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Summary */}
        {!loading && (
          <div className='mt-6 bg-white rounded-lg shadow p-6'>
            <h3 className='text-lg font-medium text-gray-900 mb-4'>Resumen</h3>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='bg-blue-50 p-4 rounded-lg'>
                <div className='text-2xl font-bold text-blue-600'>{clients.length}</div>
                <div className='text-sm text-blue-800'>Total Clientes</div>
              </div>
              <div className='bg-green-50 p-4 rounded-lg'>
                <div className='text-2xl font-bold text-green-600'>
                  {clients.filter(c => c.is_active).length}
                </div>
                <div className='text-sm text-green-800'>Activos</div>
              </div>
              <div className='bg-orange-50 p-4 rounded-lg'>
                <div className='text-2xl font-bold text-orange-600'>
                  {clients.filter(c => !c.collector_id).length}
                </div>
                <div className='text-sm text-orange-800'>Sin Asignar</div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}