import type { IDashboardOverview } from '@/app/types/dashboard';
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

export const getDashboardOverview = async (month: string): Promise<IDashboardOverview> => {
    try {
        const response =  await axiosInstance.get(`/dashboard/overview/${month}`);
        return response.data.overview;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}