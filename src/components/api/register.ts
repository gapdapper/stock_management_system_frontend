import { axiosInstance } from '@/lib/api-client';

export const register = async (user: any): Promise<any> => {
    try {
        await axiosInstance.post(`/auth/register`, user);
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}