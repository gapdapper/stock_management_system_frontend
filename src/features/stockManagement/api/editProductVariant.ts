import type { IProductVariantPayload } from '@/app/types/product';
import { axiosInstance } from '@/lib/api-client';

export const editProductVariant = async (payload: IProductVariantPayload): Promise<void> => {
    try {
        await axiosInstance.patch(`/productVariant/${payload.id}`, payload);
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}