import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const UserCreated = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-2 text-gray-900">No hay datos de usuario</h2>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium mt-4"
            onClick={() => navigate('/users')}
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-full">
        <div className="mb-4">
          <span style={{fontSize: '3rem', color: '#22c55e'}}>✔️</span>
        </div>
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Usuario creado exitosamente</h2>
        <p className="mb-6 text-gray-700">Puedes compartir estos datos con tu cliente:</p>
        <div className="text-left mb-6">
          <div className="mb-2"><strong>Usuario:</strong> {user.username}</div>
          <div className="mb-2"><strong>Nombre completo:</strong> {user.full_name}</div>
          <div className="mb-2"><strong>Rol:</strong> {user.role}</div>
          <div className="mb-2"><strong>Zona asignada:</strong> {user.zone || 'No asignada'}</div>
          <div className="mb-2"><strong>Supervisor:</strong> {user.supervisor_id ? user.supervisor_id : 'No asignado'}</div>
          <div className="mb-2"><strong>Teléfono:</strong> {user.phone || 'No registrado'}</div>
        </div>
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium"
          onClick={() => navigate('/users')}
        >
          Volver a la lista de usuarios
        </button>
      </div>
    </div>
  );
};

export default UserCreated;
