import { axiosInstance } from '@/lib/api-client';

export const getMe = async () => {
  try {
    const response = await axiosInstance.get('/auth/me', { withCredentials: true });
    return response.data.profile;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
}