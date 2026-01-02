import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useCajaStore from '../store/cajaStore';
import useAuthStore from '../store/authStore';

// Importamos los componentes que creaste
import CajaDashboard from '../components/Caja/CajaDashboard';
import CajaPanel from '../components/Caja/CajaPanel';
import CajaMovimientos from '../components/Caja/CajaMovimientos';
import CierreCajaPanel from '../components/Caja/CierreCajaPanel';
import VoladosPanel from '../components/Caja/VoladosPanel';

// Componente simple para las pestañas
const Tab = ({ label, isActive, onClick }) => (
  <button
    className={`px-4 py-2 font-medium text-sm rounded-t-lg ${
      isActive
        ? 'bg-white text-blue-600 border-b-2 border-blue-600'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }`}
    onClick={onClick}
  >
    {label}
  </button>
);

const CajaPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    saldo,
    movimientos,
    loading,
    error,
    fetchSaldo,
    fetchMovimientos,
    crearMovimiento,
  } = useCajaStore();

  const [activeTab, setActiveTab] = useState('resumen');

  // Cargar datos iniciales al montar la página
  useEffect(() => {
    fetchSaldo();
    fetchMovimientos();
  }, [fetchSaldo, fetchMovimientos]);

  const handleCrearMovimiento = async (movimientoData) => {
    try {
      await crearMovimiento(movimientoData);
      // Aquí podrías mostrar un mensaje de éxito
    } catch (err) {
      // Y aquí un mensaje de error
      console.error("Fallo al crear movimiento desde la página", err);
    }
  };

  // Datos de ejemplo para los componentes que lo necesitan
  const resumenData = {
    saldoTotal: saldo,
    microseguro: 150000, // Ejemplo
    volados: 80000, // Ejemplo
    prestamosActivos: 1200000, // Ejemplo
    gastos: 50000, // Ejemplo
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Módulo de Caja</h1>
          <button onClick={() => navigate('/dashboard')} className="text-gray-600 hover:text-gray-900">
            &larr; Volver al Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Pestañas de Navegación */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-2">
            <Tab label="Resumen" isActive={activeTab === 'resumen'} onClick={() => setActiveTab('resumen')} />
            <Tab label="Transacciones" isActive={activeTab === 'transacciones'} onClick={() => setActiveTab('transacciones')} />
            <Tab label="Cierre de Caja" isActive={activeTab === 'cierre'} onClick={() => setActiveTab('cierre')} />
            <Tab label="Volados" isActive={activeTab === 'volados'} onClick={() => setActiveTab('volados')} />
          </div>
        </div>

        {/* Contenido de las Pestañas */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading && <p>Cargando...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {activeTab === 'resumen' && (
            <CajaDashboard 
              resumen={resumenData} 
              filtros={{}} // Ejemplo
              onFiltrar={() => {}} // Ejemplo
            />
          )}

          {activeTab === 'transacciones' && (
            <div>
              <CajaPanel 
                saldo={saldo} 
                onAction={handleCrearMovimiento} 
                usuarios={[]} // Necesitaremos cargar la lista de usuarios aquí
              />
              <hr className="my-6" />
              <CajaMovimientos movimientos={movimientos} />
            </div>
          )}

          {activeTab === 'cierre' && (
            <CierreCajaPanel 
              resumenDia={{}} // Necesitaremos cargar esta info
              onConfirmarCierre={() => {}}
            />
          )}

          {activeTab === 'volados' && (
            <VoladosPanel 
              volados={[]} // Necesitaremos cargar volados
              clientes={[]} // Necesitaremos cargar clientes
              onCrearVolado={() => {}}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default CajaPage;
