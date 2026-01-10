import type { IBulkRestockPayload } from '@/app/types/product';
import { axiosInstance } from '@/lib/api-client';

export const restockProduct = async (payload: IBulkRestockPayload): Promise<void> => {
    try {
        await axiosInstance.post(`/productVariant/restock`, payload);
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}