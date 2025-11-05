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
              <div className="text-primary-600 text-4xl"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cobranzas Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              </div>
              <div className="text-secondary-600 text-4xl"></div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">--</p>
              </div>
              <div className="text-danger-600 text-4xl"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => navigate("/clients")}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <span className="text-3xl"></span>
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
                <span className="text-3xl"></span>
                <div className="text-left">
                  <p className="font-semibold text-gray-900">Nuevo Cliente</p>
                  <p className="text-sm text-gray-600">Registrar</p>
                </div>
              </button>
            )}

            <button className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition">
              <span className="text-3xl"></span>
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
            <p className="text-gray-600">
              Como administrador tienes acceso completo al sistema: gestión de clientes, usuarios, reportes y configuración.
            </p>
          )}
          {user?.role === "supervisor" && (
            <p className="text-gray-600">
              Como supervisor puedes gestionar clientes, asignar cobradores y revisar reportes de tu equipo.
            </p>
          )}
          {user?.role === "collector" && (
            <p className="text-gray-600">
              Como cobrador puedes ver tus clientes asignados, registrar pagos y actualizar estados de cobranza.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
