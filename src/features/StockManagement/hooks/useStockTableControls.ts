import type { IProductData } from "@/types/product";
import { useMemo, useState } from "react";

function useStockTableControls(rawData: IProductData[]) {
  const [sortField, setSortField] = useState<keyof IProductData>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<string>("");

  const filteredData = useMemo(() => {
    if (!filter.trim()) return rawData;

    const keyword = filter.trim().toLowerCase();
    return rawData.filter((item) =>
      item.productName.toLowerCase().includes(keyword),
    );
  }, [rawData, filter]);

  const sortedData = useMemo(() => {
    const data = [...filteredData];

    return data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal, undefined, {
              numeric: true,
              sensitivity: "base",
            })
          : bVal.localeCompare(aVal, undefined, {
              numeric: true,
              sensitivity: "base",
            });
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const handleSortChange = (field: keyof IProductData) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };

  return {
    filter,
    sortDirection,
    sortedData,
    handleFilterChange,
    handleSortChange,
  };
}

export default useStockTableControls;
