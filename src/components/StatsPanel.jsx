import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function StatsPanel() {
  const [stats, setStats] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    userId: '',
    supervisorId: ''
  });
  const [users, setUsers] = useState([]);
  const [supervisors, setSupervisors] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, [filters]);

  const fetchStats = async () => {
    const params = {};
    if (filters.startDate) params.start_date = filters.startDate;
    if (filters.endDate) params.end_date = filters.endDate;
    if (filters.userId) params.user_id = filters.userId;
    if (filters.supervisorId) params.supervisor_id = filters.supervisorId;
    const response = await api.get('/api/v1/stats/', { params });
    setStats(response.data);
  };

  const fetchUsers = async () => {
    const response = await api.get('/api/v1/users/');
    setUsers(response.data);
    setSupervisors(response.data.filter(u => u.role === 'admin' || u.role === 'supervisor'));
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-bold mb-4">Panel de Estadísticas</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          type="date"
          value={filters.startDate}
          onChange={e => setFilters(f => ({ ...f, startDate: e.target.value }))}
          className="border rounded px-2 py-1"
        />
        <input
          type="date"
          value={filters.endDate}
          onChange={e => setFilters(f => ({ ...f, endDate: e.target.value }))}
          className="border rounded px-2 py-1"
        />
        <select
          value={filters.userId}
          onChange={e => setFilters(f => ({ ...f, userId: e.target.value }))}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos los usuarios</option>
          {users.map(u => (
            <option key={u.id} value={u.id}>{u.full_name || u.username}</option>
          ))}
        </select>
        <select
          value={filters.supervisorId}
          onChange={e => setFilters(f => ({ ...f, supervisorId: e.target.value }))}
          className="border rounded px-2 py-1"
        >
          <option value="">Todos los supervisores</option>
          {supervisors.map(s => (
            <option key={s.id} value={s.id}>{s.full_name || s.username}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl text-primary-600">💰</span>
          <h3 className="text-lg font-bold mt-2">Cobranzas Realizadas</h3>
          <p className="text-2xl mt-2">{stats?.total_realizadas ?? '--'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl text-secondary-600">👥</span>
          <h3 className="text-lg font-bold mt-2">Total Clientes</h3>
          <p className="text-2xl mt-2">{stats?.total_clientes ?? '--'}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl text-danger-600">⏳</span>
          <h3 className="text-lg font-bold mt-2">Pendientes</h3>
          <p className="text-2xl mt-2">{stats?.total_pendientes ?? '--'}</p>
        </div>
      </div>
    </div>
  );
}
