import type { IProductData } from "@/types/product";
import { getProductsWithVariant } from "../api/StockManagementService";
import { getProductStatus } from "@/utils/product";
import { useEffect, useState } from "react";

function useFetchStockData() {
  const [rawData, setRawData] = useState<IProductData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProductData = async () => {
    try {
      const data = await getProductsWithVariant();
      const mappedData = data.products.map((product: IProductData) => {
        return { ...product, status: getProductStatus(product.variants) };
      });
      setRawData(mappedData);
      return mappedData;
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  return { rawData, isLoading, fetchProductData };
}

export default useFetchStockData;
