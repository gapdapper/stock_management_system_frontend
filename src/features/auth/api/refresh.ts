import { axiosInstance } from '@/lib/api-client';

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

        console.log('Token refreshed successfully');
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

