// sync-forced-2025
import React from "react";

const CierreCajaPanel = ({ cierre, onExportar }) => {
  return (
    <div className="cierre-caja-panel">
      <h2>Cierre de Caja</h2>
      <p>Fecha: {cierre.fecha}</p>
      <p>Saldo final: ${cierre.saldoFinal.toLocaleString()}</p>
      <p>Ingresos: ${cierre.ingresos.toLocaleString()}</p>
      <p>Egresos: ${cierre.egresos.toLocaleString()}</p>
      <p>Microseguro: ${cierre.microseguro.toLocaleString()}</p>
      <p>Volados: ${cierre.volados.toLocaleString()}</p>
      <p>Gastos: ${cierre.gastos.toLocaleString()}</p>
      <button onClick={onExportar}>Exportar reporte</button>
    </div>
  );
};

export default CierreCajaPanel;
