import React from "react";

const CajaMovimientos = ({ movimientos, onFiltrar }) => {
  return (
    <div className="caja-movimientos">
      <h2>Movimientos de Caja</h2>
      <div>
        <label>Filtrar por tipo:</label>
        <select onChange={onFiltrar}>
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

export default CajaMovimientos;
