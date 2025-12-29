import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
};
type AuthActions = {
  setToken: (token: string | null) => void;
  clearToken: () => void;
  setLoading: (loading: boolean) => void;
};
type AuthSlice = AuthState & AuthActions;
export const useAuthStore = create<AuthSlice>((set) => ({
  isAuthenticated: false,
  token: null,
  loading: true,
  setLoading: (loading) => set({ loading }),
  setToken: (token) =>
    set(() => {
      if (token) {
        return { token, isAuthenticated: true, loading: false };
      }
      return { token: null, isAuthenticated: false, loading: false };
    }),
  clearToken: () => set({ token: null, isAuthenticated: false, loading: false }),
}));