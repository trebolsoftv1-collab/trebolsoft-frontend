import api from '../axios';

// Obtiene la caja del usuario actual
export const getSaldo = async (userId) => {
  const { data } = await api.get(`/box/${userId}`);
  // El saldo está en data.saldo o data.base_balance según el modelo
  return data;
};

// Obtiene los movimientos de la caja del usuario actual
export const getMovimientos = async (userId, params = {}) => {
  const query = new URLSearchParams(params).toString();
  const { data } = await api.get(`/box/${userId}/history${query ? `?${query}` : ''}`);
  return data;
};

// Crea un nuevo movimiento de caja (debería adaptarse según el backend)
export const createMovimiento = async (movimientoData) => {
  // Aquí deberías adaptar el endpoint según la API real
  // Por ahora, solo lanza un error para evitar llamadas incorrectas
  throw new Error('Endpoint de creación de movimiento no implementado. Usa el endpoint correcto según la API.');
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
