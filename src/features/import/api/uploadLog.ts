import { axiosInstance } from '@/lib/api-client';

export const getUploadLog = async (): Promise<{ id: number, uploadAt: string }> => {
    try {
        const response =  await axiosInstance.get('/dailyUploadLogs');
        return response.data.uploadLog;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}