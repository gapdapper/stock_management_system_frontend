import axios, { AxiosError, type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/authSlice';
import { axiosInstance } from './api-client';


// Prevent multiple refresh calls
export let refreshPromise: Promise<string | null> | null = null;
export const refreshToken = async () => {
  const { setToken, clearToken } = useAuthStore.getState();
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await axios.post(
          '<http://localhost:4000/auth/refresh>',
          {},
          { withCredentials: true },
        );
        const newToken = res.data.accessToken;
        setToken(newToken);
        return newToken;
      } catch {
        clearToken();
        return null;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
};

// Attach token to requests
axiosInstance.interceptors.request.use((config) => {
  const { token } = useAuthStore.getState();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Refresh on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newToken = await refreshToken();
      if (newToken && originalRequest.headers) {
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);
export default axiosInstance;