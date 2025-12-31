// sync-forced-2025
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (token, user) => {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({
          token,
          user,
          isAuthenticated: true,
        });
      },

      logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },

      updateUser: (userData) => {
        const updatedUser = { ...get().user, ...userData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        set({ user: updatedUser });
      },

      // Restaurar sesión desde localStorage
      hydrate: () => {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            set({
              token,
              user,
              isAuthenticated: true,
            });
          } catch (error) {
            console.error('Error parsing user data:', error);
            get().logout();
          }
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;
