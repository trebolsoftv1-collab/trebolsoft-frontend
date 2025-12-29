import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import * as clientsAPI from '../../api/endpoints/clients';
import { getUsers } from '../../api/endpoints/users';
import ClientLocationPhoto from '../../components/ClientLocationPhoto';

export default function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, logout } = useAuthStore();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    dni: '',
    full_name: '',
    phone: '',
    phone2: '',
    email: '',
    ocupacion: '',
    city: '',
    address: '',
    latitude: null,
    longitude: null,
    collector_id: null
  });
  
  const [supervisors, setSupervisors] = useState([]);
  const [collectors, setCollectors] = useState([]);
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [mySupervisor, setMySupervisor] = useState(null);
  
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
    loadUsersData();
  }, [id]);

  const loadUsersData = async () => {
    try {
      const users = await getUsers();
      
      if (user.role === 'ADMIN') {
        // Admin ve todos los supervisores y cobradores
        const supervisorsList = users.filter(u => u.role === 'SUPERVISOR');
        const collectorsList = users.filter(u => u.role === 'COLLECTOR');
        setSupervisors(supervisorsList);
        setCollectors(collectorsList);
      } else if (user.role === 'SUPERVISOR') {
        // Supervisor ve solo sus cobradores asignados
        // El backend ya filtra los permitidos (propios + asignados), así que mostramos todos los que lleguen
        const myCollectors = users.filter(u => u.role === 'COLLECTOR');
        setCollectors(myCollectors);
      } else if (user.role === 'COLLECTOR' && user.supervisor_id) {
        // Cobrador necesita ver quién es su supervisor
        const allUsers = await getUsers(); // O una llamada optimizada si existe
        const sup = allUsers.find(u => u.id === user.supervisor_id);
        setMySupervisor(sup);
      }
    } catch (err) {
      console.error('Error loading users:', err);
    }
  };

  const loadClient = async () => {
    try {
      setLoadingClient(true);
      const data = await clientsAPI.getClient(id);
      setFormData({
        dni: data.dni,
        full_name: data.full_name,
        phone: data.phone || '',
        phone2: data.phone2 || '',
        email: data.email || '',
        ocupacion: data.ocupacion || '',
        city: data.city || '',
        address: data.address || '',
        latitude: data.latitude,
        longitude: data.longitude,
        collector_id: data.collector_id
      });
      setPhotoPreview(data.house_photo_url || '');
      
      // Si hay collector_id, buscar su supervisor para admin
      if (data.collector_id && user.role === 'ADMIN') {
        const collector = collectors.find(c => c.id === data.collector_id);
        if (collector) {
          setSelectedSupervisor(collector.supervisor_id || '');
        }
      }
    } catch (err) {
      console.error('Error loading client:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError('Error al cargar cliente');
      }
    } finally {
      setLoadingClient(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSupervisorChange = (e) => {
    const supervisorId = e.target.value;
    setSelectedSupervisor(supervisorId);
    
    // Filtrar cobradores por supervisor seleccionado
    if (supervisorId) {
      const filteredCollectors = collectors.filter(c => c.supervisor_id === parseInt(supervisorId));
      setCollectors(filteredCollectors);
      setFormData(prev => ({ ...prev, collector_id: null })); // Reset cobrador
    }
  };

  const handleLocationUpdate = (latitude, longitude) => {
    setFormData(prev => ({ ...prev, latitude, longitude }));
  };

  const handlePhotoChange = (file, preview) => {
    setPhotoFile(file);
    setPhotoPreview(preview);
  };

  const getCollectorAssignment = () => {
    if (user.role === 'ADMIN') {
      // Admin debe seleccionar supervisor y cobrador
      return formData.collector_id;
    } else if (user.role === 'SUPERVISOR') {
      // Supervisor debe seleccionar uno de sus cobradores
      return formData.collector_id;
    } else if (user.role === 'COLLECTOR') {
      // Cobrador se auto-asigna
      return user.id;
    }
    return null;
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setError('El nombre completo es requerido');
      return false;
    }
    if (!formData.phone.trim()) {
      setError('El celular es requerido');
      return false;
    }
    if (!formData.city.trim()) {
      setError('La ciudad es requerida');
      return false;
    }
    if (!formData.address.trim()) {
      setError('La dirección es requerida');
      return false;
    }
    
    // Validar asignación según rol
    const collectorId = getCollectorAssignment();
    if (!collectorId) {
      if (user.role === 'ADMIN') {
        setError('Debe seleccionar un supervisor y un cobrador');
      } else if (user.role === 'SUPERVISOR') {
        setError('Debe seleccionar un cobrador');
      }
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit ejecutado');
    if (!validateForm()) {
      return;
    }

    if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR' && user.role !== 'COLLECTOR') {
      setError('No tienes permisos para crear clientes');
      return;
    }
    try {
      setLoading(true);
      setError('');
      
      const clientData = {
        ...formData,
        collector_id: getCollectorAssignment()
      };

      if (isEdit) {
        await clientsAPI.updateClient(id, clientData, photoFile);
        setSuccess('Cliente actualizado exitosamente');
      } else {
        await clientsAPI.createClient(clientData, photoFile);
        setSuccess('Cliente creado exitosamente');
      }
      
      setTimeout(() => {
        navigate('/clients');
      }, 1500);
    } catch (err) {
      console.error('Error saving client:', err);
      if (err.response?.status === 401) {
        logout();
        navigate('/login');
      } else {
        setError(err.response?.data?.detail || 'Error al guardar cliente');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loadingClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                  {user?.full_name || user?.username} - {user?.role === 'ADMIN' ? 'Administrador' : user?.role === 'SUPERVISOR' ? 'Supervisor' : 'Cobrador'}
                </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/clients')}
                className="text-gray-600 hover:text-gray-900"
              >
                ← Volver a Clientes
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-600">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
              <p className="text-green-600">{success}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información Personal</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="dni" className="block text-sm font-medium text-gray-700">
                    DNI / Cédula
                  </label>
                  <input
                    type="text"
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="12345678"
                  />
                </div>

                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Juan Pérez García"
                  />
                </div>

                <div>
                  <label htmlFor="ocupacion" className="block text-sm font-medium text-gray-700">
                    Ocupación u Oficio
                  </label>
                  <input
                    type="text"
                    id="ocupacion"
                    name="ocupacion"
                    value={formData.ocupacion}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ej: Comerciante, Albañil, Estilista..."
                  />
                </div>
              </div>
            </div>

            {/* Información de Contacto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Celular Principal *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+57 300 123 4567"
                  />
                </div>

                <div>
                  <label htmlFor="phone2" className="block text-sm font-medium text-gray-700">
                    Celular 2 (Opcional)
                  </label>
                  <input
                    type="tel"
                    id="phone2"
                    name="phone2"
                    value={formData.phone2}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="+57 311 234 5678"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email (Opcional)
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="cliente@email.com"
                  />
                </div>
              </div>
            </div>

            {/* Información de Ubicación */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Información de Ubicación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Medellín, Bogotá, Cali..."
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Calle 123 #45-67, Barrio Centro"
                  />
                </div>
              </div>
            </div>

            {/* Asignación según Rol */}
            {user.role === 'ADMIN' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Asignación (Admin)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="supervisor" className="block text-sm font-medium text-gray-700">
                      Supervisor *
                    </label>
                    <select
                      id="supervisor"
                      value={selectedSupervisor}
                      onChange={handleSupervisorChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Seleccionar supervisor...</option>
                      {supervisors.map(supervisor => (
                        <option key={supervisor.id} value={supervisor.id}>
                          {supervisor.full_name} - {supervisor.zone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="collector_id" className="block text-sm font-medium text-gray-700">
                      Cobrador *
                    </label>
                    <select
                      id="collector_id"
                      name="collector_id"
                      value={formData.collector_id || ''}
                      onChange={handleInputChange}
                      required
                      disabled={!selectedSupervisor}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100"
                    >
                      <option value="">Seleccionar cobrador...</option>
                      {collectors.filter(c => c.supervisor_id === parseInt(selectedSupervisor)).map(collector => (
                        <option key={collector.id} value={collector.id}>
                          {collector.full_name} - {collector.zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'SUPERVISOR' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Asignación (Supervisor)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Supervisor Asignado
                    </label>
                    <input
                      type="text"
                      value={`${user.full_name} - ${user.zone}`}
                      disabled
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label htmlFor="collector_id" className="block text-sm font-medium text-gray-700">
                      Cobrador *
                    </label>
                    <select
                      id="collector_id"
                      name="collector_id"
                      value={formData.collector_id || ''}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Seleccionar cobrador...</option>
                      {collectors.map(collector => (
                        <option key={collector.id} value={collector.id}>
                          {collector.full_name} - {collector.zone}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {user.role === 'COLLECTOR' && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Asignación (Cobrador)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Supervisor Asignado
                    </label>
                    <input
                      type="text"
                      value={mySupervisor ? mySupervisor.full_name : 'Cargando...'}
                      disabled
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Cobrador Asignado
                    </label>
                    <input
                      type="text"
                      value={user.full_name}
                      disabled
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Ubicación y Foto */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Ubicación y Foto</h3>
              <ClientLocationPhoto
                onLocationUpdate={(loc) => {
                  if (loc && loc.latitude && loc.longitude) {
                    setFormData(prev => ({ ...prev, latitude: loc.latitude, longitude: loc.longitude }));
                  }
                }}
                onPhotoSelect={(file) => {
                  setPhotoFile(file);
                  setPhotoPreview(file ? URL.createObjectURL(file) : '');
                }}
                initialLocation={formData.latitude && formData.longitude ? { latitude: formData.latitude, longitude: formData.longitude } : null}
                initialPhoto={photoPreview}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/clients')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (isEdit ? 'Actualizar Cliente' : 'Crear Cliente')}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}