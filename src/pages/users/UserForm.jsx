// sync-forced-2025
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createUser, updateUser, getUser, getUsers } from '../../api/endpoints/users';
import useAuthStore from '../../store/authStore';

const UserForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user: currentUser } = useAuthStore();
  const isEditing = Boolean(id);
  // Si no es admin, mostrar acceso denegado
  if (!currentUser || currentUser.role !== 'ADMIN') {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="mb-4">
            <span style={{fontSize: '3rem', color: '#facc15'}}>⚠️</span>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-gray-900">Acceso Denegado</h2>
          <p className="mb-6 text-gray-700">No tienes permisos para acceder a esta sección.</p>
          <button
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium"
            onClick={() => navigate(-1)}
          >
            Volver
          </button>
        </div>
      </div>
    );
  }
  
  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    phone: '',
    zone: '',
    role: 'COLLECTOR',
    supervisor_id: '',
    password: '',
    confirmPassword: ''
  });
  
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSupervisors();
    if (isEditing) {
      fetchUser();
    }
  }, [id]);

  const fetchSupervisors = async () => {
    try {
      const users = await getUsers();
      const supervisorsList = users.filter(u => u.role === 'ADMIN' || u.role === 'SUPERVISOR');
      setSupervisors(supervisorsList);
    } catch (err) {
      console.error('Error fetching supervisors:', err);
    }
  };

  const fetchUser = async () => {
    try {
      const userData = await getUser(id);
      setFormData({
        username: userData.username || '',
        full_name: userData.full_name || '',
        phone: userData.phone || '',
        zone: userData.zone || '',
        role: userData.role || 'COLLECTOR',
        supervisor_id: userData.supervisor_id || '',
        password: '',
        confirmPassword: ''
      });
    } catch (err) {
      setError('Error al cargar el usuario');
      console.error('Error fetching user:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isEditing && formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!isEditing && !formData.password) {
      setError('La contraseña es requerida para nuevos usuarios');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const userData = {
        username: formData.username,
        full_name: formData.full_name,
        phone: formData.phone || null,
        zone: formData.zone || null,
        role: formData.role,
        supervisor_id: formData.supervisor_id ? parseInt(formData.supervisor_id) : null
      };

      if (!isEditing) {
        userData.password = formData.password;
        const createdUser = await createUser(userData);
        navigate('/users/created', { state: { user: createdUser } });
      } else {
        // Si está editando y hay contraseña nueva, incluirla
        if (formData.password) {
          userData.password = formData.password;
        }
        await updateUser(id, userData);
        navigate('/users');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar el usuario');
      console.error('Error saving user:', err);
    } finally {
      setLoading(false);
    }
  };

  // Solo admin puede acceder a esta página
  // Restricción eliminada: la visibilidad del módulo ya está controlada en el dashboard

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
          </h1>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        <div className="bg-white shadow rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Usuario */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Usuario *
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="usuario123"
                />
              </div>

              {/* Nombre Completo */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Juan Pérez"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Teléfono */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Número Celular *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="+57 300 123 4567"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Rol */}
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                  Rol *
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="COLLECTOR">Cobrador</option>
                  <option value="SUPERVISOR">Supervisor</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>

              {/* Zona */}
              <div>
                <label htmlFor="zone" className="block text-sm font-medium text-gray-700">
                  Zona Asignada *
                </label>
                <input
                  type="text"
                  id="zone"
                  name="zone"
                  value={formData.zone}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Centro, Norte, Sur, etc."
                />
              </div>
            </div>

            {/* Supervisor (solo para cobradores) */}
            {formData.role === 'COLLECTOR' && (
              <div>
                <label htmlFor="supervisor_id" className="block text-sm font-medium text-gray-700">
                  Supervisor Asignado *
                </label>
                <select
                  id="supervisor_id"
                  name="supervisor_id"
                  value={formData.supervisor_id}
                  onChange={handleChange}
                  required={formData.role === 'collector'}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="">Seleccionar supervisor...</option>
                  {supervisors.map(supervisor => (
                    <option key={supervisor.id} value={supervisor.id}>
                      {supervisor.full_name} ({supervisor.role})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Contraseñas (solo para crear nuevo usuario) */}
            {!isEditing && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Contraseña *
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirmar Contraseña *
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => navigate('/users')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Usuario')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;