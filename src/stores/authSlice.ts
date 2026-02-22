import { create } from 'zustand';

type AuthState = {
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  user: {
    id: string;
    username: string;
    role: string;
  } | null;
};
type AuthActions = {
  setToken: (token: string | null) => void;
  clearToken: () => void;
  setLoading: (loading: boolean) => void;
  setUser: (user: { id: string; username: string; role: string; firstName?: string; lastName?: string } | null) => void;
};
type AuthSlice = AuthState & AuthActions;
export const useAuthStore = create<AuthSlice>((set) => ({
  isAuthenticated: false,
  token: null,
  loading: true,
  user: null,
  setLoading: (loading) => set({ loading }),
  setToken: (token) =>
    set(() => {
      if (token) {
        return { token, isAuthenticated: true, loading: false };
      }
      return { token: null, isAuthenticated: false, loading: false };
    }),
  clearToken: () => set({ token: null, isAuthenticated: false, loading: false, user: null }),
  setUser: (user) => set({ user }),
}));