import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/clients/ClientList';
import ClientForm from './pages/clients/ClientForm';
import UsersList from './pages/users/UsersList';
import UserForm from './pages/users/UserForm';

function App() {
  const hydrate = useAuthStore((state) => state.hydrate);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Restaurar sesión al cargar la app
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta raíz: redirige según autenticación */}
        <Route
          path="/"
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
          }
        />

        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Dashboard - Protegido */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Lista de Clientes - Protegido */}
        <Route
          path="/clients"
          element={
            <ProtectedRoute>
              <ClientList />
            </ProtectedRoute>
          }
        />

        {/* Crear Cliente - Todos pueden crear */}
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute>
              <ClientForm />
            </ProtectedRoute>
          }
        />

        {/* Ver Cliente - Todos pueden ver */}
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute>
              <ClientList />
            </ProtectedRoute>
          }
        />

        {/* Editar Cliente - Solo Admin y Supervisor */}
        <Route
          path="/clients/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['ADMIN', 'SUPERVISOR']}>
              <ClientForm />
            </ProtectedRoute>
          }
        />

        {/* === RUTAS DE USUARIOS (Solo Admin) === */}
        {/* Lista de Usuarios - Solo Admin */}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersList />
            </ProtectedRoute>
          }
        />

        {/* Crear Usuario - Solo Admin */}
        <Route
          path="/users/new"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserForm />
            </ProtectedRoute>
          }
        />

        {/* Ver/Editar Usuario - Solo Admin */}
        <Route
          path="/users/:id"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UsersList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users/:id/edit"
          element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserForm />
            </ProtectedRoute>
          }
        />

        {/* Ruta 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;