import { create } from 'zustand';

import * as cajaAPI from '../api/endpoints/caja';
import useAuthStore from './authStore';

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
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('Usuario no autenticado');
      const saldoData = await cajaAPI.getSaldo(user.id);
      // El saldo puede estar en saldoData.saldo o saldoData.base_balance
      set({ saldo: saldoData.saldo ?? saldoData.base_balance ?? 0, loading: false });
    } catch (error) {
      set({ error: 'Error al cargar el saldo', loading: false });
      console.error(error);
    }
  },

  /**
   * Carga la lista de movimientos de caja.
   * @param {object} filters - Filtros para la búsqueda de movimientos.
   */

  fetchMovimientos: async (filters = {}) => {
    try {
      set({ loading: true, error: null });
      const user = useAuthStore.getState().user;
      if (!user) throw new Error('Usuario no autenticado');
      const movimientosData = await cajaAPI.getMovimientos(user.id, filters);
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
