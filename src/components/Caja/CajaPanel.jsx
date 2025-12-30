import React from "react";

const CajaPanel = ({ caja, movimientos, onRetiro, onTransferencia, onCierre }) => {
  return (
    <div className="caja-panel">
      <h2>Caja: {caja.tipo === "principal" ? "Principal" : "Microseguro"}</h2>
      <p>Saldo actual: ${caja.saldo.toLocaleString()}</p>
      <button onClick={onRetiro}>Retirar</button>
      {caja.tipo === "principal" && <button onClick={onTransferencia}>Transferir</button>}
      <button onClick={onCierre}>Cierre de caja</button>
      <h3>Movimientos recientes</h3>
      <ul>
        {movimientos.map((mov) => (
          <li key={mov.id}>
            <strong>{mov.tipo}</strong>: ${mov.monto.toLocaleString()} - {mov.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CajaPanel;
