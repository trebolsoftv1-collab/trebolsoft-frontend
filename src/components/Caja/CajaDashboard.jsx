// sync-forced-2025
import React from "react";

const CajaDashboard = ({ resumen, filtros, onFiltrar }) => {
  return (
    <div className="caja-dashboard">
      <h2>Dashboard de Caja</h2>
      <div>
        <label>Filtrar por usuario:</label>
        <select onChange={onFiltrar} value={filtros.usuarioId}>
          {/* Opciones de usuarios */}
        </select>
        <label>Filtrar por tipo de movimiento:</label>
        <select onChange={onFiltrar} value={filtros.tipo}>
          <option value="">Todos</option>
          <option value="ingreso">Ingreso</option>
          <option value="egreso">Egreso</option>
          <option value="transferencia">Transferencia</option>
          <option value="retiro">Retiro</option>
          <option value="gasto">Gasto</option>
          <option value="microseguro">Microseguro</option>
          <option value="prestamo">Préstamo</option>
          <option value="abono">Abono</option>
          <option value="volado">Volado</option>
          <option value="cierre">Cierre</option>
        </select>
      </div>
      <div>
        <h3>Resumen</h3>
        <p>Saldo total: ${resumen.saldoTotal.toLocaleString()}</p>
        <p>Microseguro: ${resumen.microseguro.toLocaleString()}</p>
        <p>Volados: ${resumen.volados.toLocaleString()}</p>
        <p>Préstamos activos: ${resumen.prestamosActivos.toLocaleString()}</p>
        <p>Gastos: ${resumen.gastos.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CajaDashboard;
