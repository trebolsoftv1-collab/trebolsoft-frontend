// sync-forced-2025
import { useState } from "react";
import ChangePassword from "./ChangePassword";
import useAuthStore from "../store/authStore";

export default function UserMenu({ onLogout }) {
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const { user } = useAuthStore();

  const handleMenuClick = () => setOpen((v) => !v);
  const handleLogoutClick = () => {
    setOpen(false);
    onLogout();
  };
  const handleChangePasswordClick = () => {
    setOpen(false);
    setShowChangePassword(true);
  };
  const handleCloseChangePassword = () => setShowChangePassword(false);

  return (
    <div className="relative">
      <button
        className="p-2 rounded hover:bg-gray-200"
        onClick={handleMenuClick}
        aria-label="Menú de usuario"
      >
        <span className="block w-6 h-6">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="17" x2="20" y2="17" />
          </svg>
        </span>
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-10">
          {user?.role !== 'COLLECTOR' && (
            <button
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={handleChangePasswordClick}
            >
              Cambiar contraseña
            </button>
          )}
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-danger-600"
            onClick={handleLogoutClick}
          >
            Cerrar sesión
          </button>
        </div>
      )}
      {showChangePassword && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20">
          <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleCloseChangePassword}
              aria-label="Cerrar"
            >
              ×
            </button>
            <ChangePassword />
          </div>
        </div>
      )}
    </div>
  );
}
