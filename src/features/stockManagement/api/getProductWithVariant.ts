import type { IProductData } from '@/app/types/product';
import { axiosInstance } from '@/lib/api-client';

export const getProductsWithVariant = async (): Promise<{products:IProductData[]}> => {
    try {
        const response =  await axiosInstance.get('/products/all');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}