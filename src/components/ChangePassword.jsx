import { useState } from "react";
import axios from "../api/axios";

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.patch(
        "/users/me/password",
        { current_password: currentPassword, new_password: newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Contraseña cambiada exitosamente.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(
        err.response?.data?.detail || "Error al cambiar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-4">Cambiar contraseña</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      {success && <div className="text-green-600 mb-2">{success}</div>}
      <div className="mb-4">
        <label className="block mb-1">Contraseña actual</label>
        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1">Nueva contraseña</label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Cambiando..." : "Cambiar contraseña"}
      </button>
    </form>
  );
}
