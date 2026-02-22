import { axiosInstance } from '@/lib/api-client';

export const checkAvailableUsernames = async (username: string): Promise<any> => {
    try {
        const response =  await axiosInstance.get(`/auth/check-usernames?username=${username}`);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch available usernames:', error);
        throw error;   
    }
}