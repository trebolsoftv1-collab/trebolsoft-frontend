// sync-forced-2025
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

export default function Stats() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [stats, setStats] = useState({
    total_cobranzas: 0,
    total_clientes: 0,
    total_pendientes: 0,
    total_realizadas: 0,
    monto_total: 0
  });
  const [loading, setLoading] = useState(false);
  
  // Fechas por defecto: Hoy
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    loadStats();
  }, [startDate, endDate]);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Construir query params
      let url = `/api/v1/stats/?start_date=${startDate}&end_date=${endDate}`;
      
      const { data } = await api.get(url);
      setStats(data);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP', 
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Reportes y Estadísticas</h1>
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
            ← Volver al Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filtros */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Inicio</label>
            <input 
              type="date" 
              value={startDate} 
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Fecha Fin</label>
            <input 
              type="date" 
              value={endDate} 
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-md px-3 py-2"
            />
          </div>
          <button 
            onClick={loadStats}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Actualizar
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Calculando estadísticas...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Tarjetas */}
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">
              <p className="text-sm text-gray-500">Dinero Recaudado</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monto_total)}</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">
              <p className="text-sm text-gray-500">Cobros Realizados</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_cobranzas}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">
              <p className="text-sm text-gray-500">Total Clientes Activos</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_clientes}</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border-l-4 border-red-500">
              <p className="text-sm text-gray-500">Créditos Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total_pendientes}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
