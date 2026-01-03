import { requestRefreshToken } from '@/features/auth/api/refresh';
import { useAuthStore } from '@/stores/authSlice';

export const refreshToken = async (): Promise<void> => {
  const { setToken, clearToken } = useAuthStore.getState();

  try {
    const token = await requestRefreshToken();
    setToken(token);
  } catch {
    clearToken();
  } finally {
  }
};
