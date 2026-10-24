import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Employee {
  id: string;
  username: string;
  role: string;
}

interface AuthState {
  employee: Employee | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (employee: Employee, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      employee: null,
      token: null,
      isAuthenticated: false,
      login: (employee, token) =>
        set({
          employee,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          employee: null,
          token: null,
          isAuthenticated: false,
        }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
