import { create } from 'zustand';
import * as cajaAPI from '../api/endpoints/caja';

const useCajaStore = create((set, get) => ({
  // --- ESTADO (DATOS) ---
  saldo: 0,
  movimientos: [],
  volados: [],
  cierreInfo: null,
  loading: false,
  error: null,

  // --- ACCIONES (FUNCIONES) ---

  /**
   * Carga el saldo inicial del usuario.
   */
  fetchSaldo: async () => {
    try {
      set({ loading: true, error: null });
      const saldoData = await cajaAPI.getSaldo();
      set({ saldo: saldoData.saldo, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar el saldo', loading: false });
      console.error(error);
    }
  },

  /**
   * Carga la lista de movimientos de caja.
   * @param {object} filters - Filtros para la búsqueda de movimientos.
   */
  fetchMovimientos: async (filters) => {
    try {
      set({ loading: true, error: null });
      const movimientosData = await cajaAPI.getMovimientos(filters);
      set({ movimientos: movimientosData, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar los movimientos', loading: false });
      console.error(error);
    }
  },

  /**
   * Registra un nuevo movimiento y actualiza el estado.
   * @param {object} movimientoData - Datos del nuevo movimiento.
   */
  crearMovimiento: async (movimientoData) => {
    try {
      set({ loading: true, error: null });
      await cajaAPI.createMovimiento(movimientoData);
      // Después de crear, volvemos a cargar el saldo y los movimientos para reflejar el cambio.
      get().fetchSaldo();
      get().fetchMovimientos();
    } catch (error) {
      set({ error: 'Error al crear el movimiento', loading: false });
      console.error(error);
      throw error; // Re-lanzamos el error para que el componente pueda manejarlo (ej: mostrar un mensaje).
    }
  },
  
  // Aquí se podrían agregar las funciones para `fetchVolados`, `createCierre`, etc.
  // siguiendo el mismo patrón.

}));

export default useCajaStore;
