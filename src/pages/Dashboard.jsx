// sync-forced-2025
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import UserMenu from "../components/UserMenu";
import api from "../api/axios";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [stats, setStats] = useState({ moneyToday: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Obtener fecha de hoy en formato YYYY-MM-DD
        const today = new Date().toISOString().split('T')[0];
        // Consultar API filtrando por hoy para ver lo recaudado
        const { data } = await api.get(`/stats/?start_date=${today}&end_date=${today}`);
        setStats({
          moneyToday: data.monto_total || 0,
          pending: data.total_pendientes || 0
        });
      } catch (error) {
        console.error("Error cargando estadísticas:", error);
      }
    };

    if (user) fetchStats();
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleLabels = {
    ADMIN: "Administrador",
    SUPERVISOR: "Supervisor",
    COLLECTOR: "Cobrador",
  };

  const roleColors = {
    ADMIN: "bg-danger-100 text-danger-800",
    SUPERVISOR: "bg-secondary-100 text-secondary-800",
    COLLECTOR: "bg-primary-100 text-primary-800",
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
              <UserMenu onLogout={handleLogout} />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Cobranzas Hoy</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(stats.moneyToday)}
                </p>
              </div>
              <div className="text-secondary-600 text-4xl">💰</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stats.pending}</p>
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

            {(user?.role === "ADMIN" || user?.role === "SUPERVISOR") && (
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

            {user?.role === "ADMIN" && (
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

            <button 
              onClick={() => navigate("/stats")}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition"
            >
              <span className="text-3xl">📊</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Reportes</p>
                <p className="text-sm text-gray-600">Ver estadísticas</p>
              </div>
            </button>

            {/* === BOTÓN DE CAJA === */}
            <button
              onClick={() => navigate("/caja")}
              className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition"
            >
              <span className="text-3xl">💰</span>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Caja</p>
                <p className="text-sm text-gray-600">Saldos y movimientos</p>
              </div>
            </button>

          </div>
        </div>


      </main>
    </div>
  );
}