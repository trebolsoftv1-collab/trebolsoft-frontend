import api from '../axios';

// --- MOVIMIENTOS GENERALES DE CAJA ---

/**
 * Obtiene el saldo actual de la caja para el usuario logueado.
 */
export const getSaldo = async () => {
  const { data } = await api.get('/caja/saldo');
  return data;
};

/**
 * Obtiene una lista de movimientos de caja, con filtros opcionales.
 * @param {object} filters - Opcional. Objeto con filtros como { userId, tipo, fechaInicio, fechaFin }.
 */
export const getMovimientos = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await api.get(`/caja/movimientos?${params}`);
  return data;
};

/**
 * Crea un nuevo movimiento de caja (transferencia, gasto, retiro, etc.).
 * @param {object} movimientoData - Datos del movimiento a crear.
 */
export const createMovimiento = async (movimientoData) => {
  const { data } = await api.post('/caja/movimientos', movimientoData);
  return data;
};


// --- CIERRE DE CAJA ---

/**
 * Obtiene la información necesaria para realizar el cierre de caja diario.
 */
export const getCierreInfo = async () => {
    const { data } = await api.get('/caja/cierre/info');
    return data;
};

/**
 * Confirma y ejecuta el cierre de caja.
 * @param {object} cierreData - Datos del cierre.
 */
export const createCierre = async (cierreData) => {
    const { data } = await api.post('/caja/cierre', cierreData);
    return data;
};


// --- VOLADOS ---

/**
 * Obtiene la lista de volados.
 */
export const getVolados = async () => {
    const { data } = await api.get('/caja/volados');
    return data;
};

/**
 * Crea un nuevo volado.
 * @param {object} voladoData - Datos del volado.
 */
export const createVolado = async (voladoData) => {
    const { data } = await api.post('/caja/volados', voladoData);
    return data;
};

// NOTA: Las rutas de API como '/caja/saldo' son un ejemplo y deberán ser implementadas 
// en el backend (FastAPI) para que estas funciones operen correctamente.
