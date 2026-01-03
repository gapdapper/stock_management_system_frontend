import { axiosInstance } from '@/lib/api-client';
import { useAuthStore } from '@/stores/authSlice';

export const logout = async () => {
  const { clearToken } = useAuthStore.getState();
  try {
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
  } catch {
    console.error('Logout failed');
  }
  clearToken();
}
