import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface Account {
  id: string;
  username: string;
  role: string;
}

interface AuthState {
  account: Account | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (account: Account, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      account: null,
      token: null,
      isAuthenticated: false,
      login: (account, token) =>
        set({
          account,
          token,
          isAuthenticated: true,
        }),
      logout: () =>
        set({
          account: null,
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
