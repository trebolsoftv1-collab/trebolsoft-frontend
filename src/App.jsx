import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ClientList from './pages/clients/ClientList';
import ClientForm from './pages/clients/ClientForm';

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

        {/* Crear Cliente - Protegido (solo admin y supervisor) */}
        <Route
          path="/clients/new"
          element={
            <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
              <ClientForm />
            </ProtectedRoute>
          }
        />

        {/* Editar Cliente - Protegido (solo admin y supervisor) */}
        <Route
          path="/clients/:id"
          element={
            <ProtectedRoute allowedRoles={['admin', 'supervisor']}>
              <ClientForm />
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
