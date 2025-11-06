import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabels = {
    admin: "Administrador",
    supervisor: "Supervisor",
    collector: "Cobrador",
  };

  const roleColors = {
    admin: "bg-danger-100 text-danger-800",
    supervisor: "bg-secondary-100 text-secondary-800",
    collector: "bg-primary-100 text-primary-800",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">TrebolSoft</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenido, {user?.full_name || user?.username}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${roleColors[user?.role]}`}>
                {roleLabels[user?.role]}
              </span>
              <button
                onClick={handleLogout}
                className="bg-danger-600 text-white px-4 py-2 rounded-lg hover:bg-danger-700 transition"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              </div>
              <div className="text-primary-600 text-4xl">👥</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cobranzas Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              </div>
              <div className="text-secondary-600 text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              </div>
              <div className="text-danger-600 text-4xl">⏰</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => navigate("/clients")}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <span className="text-3xl">👥</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Ver Clientes</p>
                <p className="text-sm text-gray-600">Lista completa</p>
              </div>
            </button>

            {(user?.role === "admin" || user?.role === "supervisor") && (
              <button
                onClick={() => navigate("/clients/new")}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
              >
                <span className="text-3xl">➕</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Nuevo Cliente</p>
                  <p className="text-sm text-gray-600">Registrar</p>
                </div>
              </button>
            )}

            {user?.role === "admin" && (
              <button
                onClick={() => navigate("/users")}
                className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition"
              >
                <span className="text-3xl">👤</span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Gestionar Usuarios</p>
                  <p className="text-sm text-gray-600">Supervisores y Cobradores</p>
                </div>
              </button>
            )}

            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition">
              <span className="text-3xl">📊</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Reportes</p>
                <p className="text-sm text-gray-600">Ver estadísticas</p>
              </div>
            </button>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Panel de {roleLabels[user?.role]}
          </h3>
          {user?.role === "admin" && (
            <div className="text-gray-600">
              <p className="mb-2">Como administrador tienes acceso completo al sistema:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>✅ Gestión completa de usuarios (crear supervisores y cobradores)</li>
                <li>✅ Gestión de clientes y asignación por zonas</li>
                <li>✅ Reportes y estadísticas generales</li>
                <li>✅ Configuración del sistema</li>
                <li>✅ Ver toda la información sin restricciones</li>
              </ul>
            </div>
          )}
          {user?.role === "supervisor" && (
            <div className="text-gray-600">
              <p className="mb-2">Como supervisor puedes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>✅ Gestionar clientes de tu zona asignada</li>
                <li>✅ Ver y supervisar a tus cobradores asignados</li>
                <li>✅ Reportes de tu equipo y zona</li>
                <li>❌ No puedes ver información de otros supervisores</li>
              </ul>
            </div>
          )}
          {user?.role === "collector" && (
            <div className="text-gray-600">
              <p className="mb-2">Como cobrador puedes:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>✅ Ver tus clientes asignados únicamente</li>
                <li>✅ Registrar pagos y actualizar estados</li>
                <li>✅ Ver tu historial de cobranzas</li>
                <li>❌ No puedes ver clientes de otros cobradores</li>
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}