import { axiosInstance } from '@/lib/api-client';

export const getAvailableMonths = async (): Promise<any> => {
    try {
        const response =  await axiosInstance.get("/dashboard/months");
        return response.data.availableMonths;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}