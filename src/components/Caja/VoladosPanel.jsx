import React from "react";

const VoladosPanel = ({ clientesVolados, onRecuperar }) => {
  return (
    <div className="volados-panel">
      <h2>Clientes Volados</h2>
      <ul>
        {clientesVolados.map((cliente) => (
          <li key={cliente.id}>
            <strong>{cliente.full_name}</strong> - DNI: {cliente.dni} - Deuda: ${cliente.deuda.toLocaleString()}
            <button onClick={() => onRecuperar(cliente.id)}>Registrar pago/recuperar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VoladosPanel;
