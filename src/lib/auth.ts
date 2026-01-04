import { requestRefreshToken } from '@/features/auth/api/refresh';
import { useAuthStore } from '@/stores/authSlice';
import { getMe } from '@/features/auth/api/me';

export const refreshToken = async (): Promise<string | null> => {
  const { setToken, clearToken } = useAuthStore.getState();

  try {
    const token = await requestRefreshToken();
    setToken(token);
    return token;
  } catch {
    clearToken();
    return null;
  }
};


export const setProfile = async (): Promise<void> => {
  const { setUser } = useAuthStore.getState();

  try {
    const user = await getMe();
    setUser(user);
  } catch (error) {
    console.error('Failed to set user profile:', error);
  }
}