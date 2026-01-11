import Headers from "@/features/stockManagement/components/headers";
import Table from "@/features/stockManagement/components/table";
import { getProductsWithVariant } from "@/features/stockManagement/api/getProductWithVariant";
import { useEffect, useMemo, useState } from "react";
import type { IProductData } from "../types/product";
import { getProductStatus } from "@/utils/product";
import LoadingSpinner from "@/components/loadingSpinner";

function StockManagement() {
  const [rawData, setRawData] = useState<IProductData[]>([]);
  const [sortField, setSortField] = useState<keyof IProductData>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProductData = async () => {
    try {
      const data = await getProductsWithVariant();
      const mappedData = data.products.map((product) => {
        return { ...product, status: getProductStatus(product.variants) };
      });
      setRawData(mappedData);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const sortedData = useMemo(() => {
    let data = [...rawData];
    if (filter.trim()) {
      const keyword = filter.trim().toLowerCase();
      data = data.filter((item) =>
        item.productName.toLowerCase().includes(keyword)
      );
    }
    return data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [rawData, sortField, sortDirection, filter]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5 pt-5">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <Headers
          filterVal={filter}
          setFilterVal={setFilter}
          data={rawData}
          onRefresh={fetchProductData}
        />
        <Table
          data={sortedData}
          onRefresh={fetchProductData}
          currentSortDirection={sortDirection}
          onSort={(payload) => {
            setSortField(payload.field);
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </>
    );
  }
}

export default StockManagement;
