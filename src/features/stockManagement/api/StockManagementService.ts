import type { IBulkRestockPayload, IProductData, IProductVariantPayload } from '@/app/types/product';
import { axiosInstance } from '@/lib/api-client';

export const editProductVariant = async (payload: IProductVariantPayload): Promise<void> => {
    try {
        await axiosInstance.patch(`/productVariant/${payload.id}`, payload);
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}

export const getProductsWithVariant = async (): Promise<{products:IProductData[]}> => {
    try {
        const response =  await axiosInstance.get('/products/all');
        return response.data;
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}

export const restockProduct = async (payload: IBulkRestockPayload): Promise<void> => {
    try {
        await axiosInstance.post(`/productVariant/restock`, payload);
    } catch (error) {
        console.error('Failed to fetch upload logs:', error);
        throw error;   
    }
}

export const uploadProductImage = async (
  entityType: "product" | "variant",
  entityId: number,
  file: File,
): Promise<void> => {

  const routePrefix = entityType == "product" ? "products" : "productVariant";
  try {
    await axiosInstance.post(
      `/${routePrefix}/${entityId}/upload`,
      { image: file },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  } catch (error) {
    console.error("Failed to fetch upload logs:", error);
    throw error;
  }
};
