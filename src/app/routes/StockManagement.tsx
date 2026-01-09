import Headers from "@/features/stockManagement/components/headers";
import Table from "@/features/stockManagement/components/table";
import { getProductsWithVariant } from "@/features/stockManagement/api/getProductWithVariant";
import { useEffect, useState } from "react";
import type { IProductData } from "../types/product";

function StockManagement() {
  const [productData, setProductData] = useState<IProductData[]>([]);

  const fetchProductData = async () => {
    try {
      const data = await getProductsWithVariant()
      setProductData(data.products)
    } catch (error) {
      console.error('Failed to fetch product data')
    }
  }
  // fetch actual data
  useEffect(() => {

    fetchProductData()
  }, [])

  return (
    <>
      <Headers />
      <Table data={productData} onRefresh={fetchProductData}/>
    </>
  );
}

export default StockManagement;
