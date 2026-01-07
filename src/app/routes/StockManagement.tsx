import Headers from "@/features/stockManagement/components/headers";
import Table from "@/features/stockManagement/components/table";
import { getProductsWithVariant } from "@/features/stockManagement/api/getProductWithVariant";
import { useEffect, useState } from "react";
import type { IProductData } from "../types/product";

function StockManagement() {
  const [productData, setProductData] = useState<IProductData[]>([]);

  // fetch actual data
  useEffect(() => {
    const getProductData = async () => {
      try {
        const data = await getProductsWithVariant()
        console.log(data.products)
        setProductData(data.products)
      } catch (error) {
        console.error('Failed to fetch product data')
      }
    }

    getProductData()
  }, [])

  return (
    <>
      <Headers />
      <Table data={productData}/>
    </>
  );
}

export default StockManagement;
