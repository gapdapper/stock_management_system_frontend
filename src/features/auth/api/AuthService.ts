import { axiosInstance } from "@/lib/api-client";
import { useAuthStore } from "@/stores/authSlice";

export const login = async (username: string, password: string) => {
  try {
    const res = await axiosInstance.post(
      "/auth/login",
      { username, password },
      { withCredentials: true }
    );

    const accessToken = res.data.accessToken;
    return accessToken;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async () => {
  const { clearToken } = useAuthStore.getState();
  try {
    await axiosInstance.post('/auth/logout', {}, { withCredentials: true });
  } catch {
    console.error('Logout failed');
  }
  clearToken();
}

export const getMe = async () => {
  try {
    const response = await axiosInstance.get('/auth/me', { withCredentials: true });
    return response.data.profile;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    throw error;
  }
}

let refreshPromise: Promise<string> | null = null;

export const requestRefreshToken = (): Promise<string> => {
    if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const res = await axiosInstance.post(
          '/auth/refresh',
          {},
          { withCredentials: true }
        );
        if (!res.data?.accessToken) {
          throw new Error('No access token in refresh response');
        }
        return res.data.accessToken;
      } catch (err) {
        throw err;
      } finally {
        refreshPromise = null;
      }
    })();
  }

  return refreshPromise;
};

export const register = async (user: any): Promise<any> => {
    try {
        await axiosInstance.post(`/auth/register`, user);
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}

export const checkAvailableUsernames = async (username: string): Promise<any> => {
    try {
        const response =  await axiosInstance.get(`/auth/check-username?username=${username}`);
        return response.data.isAvailable;
    } catch (error) {
        console.error('Failed to fetch available usernames:', error);
        throw error;   
    }
}