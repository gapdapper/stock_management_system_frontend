import { axiosInstance } from '@/lib/api-client';
import { type IDashboardOverview } from '@/app/types/dashboard';

export const getDashboardOverview = async (): Promise<IDashboardOverview> => {
    try {
        const response =  await axiosInstance.get('/dashboard/');
        return response.data.overview;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}