import { axiosInstance } from '@/lib/api-client';

export const findAllUsernames = async (): Promise<any> => {
    try {
        const response =  await axiosInstance.get(`/auth/users`);
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}