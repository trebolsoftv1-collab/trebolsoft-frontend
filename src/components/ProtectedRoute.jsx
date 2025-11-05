import { Navigate, useLocation } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirigir a login guardando la ruta actual
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Si se especifican roles permitidos, validar
  if (allowedRoles.length > 0 && user) {
    if (!allowedRoles.includes(user.role)) {
      // Usuario autenticado pero sin permiso para esta ruta
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-danger-600 text-5xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Acceso Denegado</h2>
            <p className="text-gray-600 mb-6">
              No tienes permisos para acceder a esta sección.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition"
            >
              Volver
            </button>
          </div>
        </div>
      );
    }
  }

  return children;
}
