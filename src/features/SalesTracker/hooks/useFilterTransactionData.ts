import type { IFilter, ITransactions } from "@/types/transaction";
import { useEffect, useState } from "react";

function useFilterTransactionData(rawData: ITransactions[]) {
  const [filterData, setFilterData] = useState<ITransactions[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    platform: "all",
    status: "all",
    period: "all",
  });

  useEffect(() => {
    let result = [...rawData];

    // Status filter
    if (filter.status !== "all") {
      result = result.filter((item) => item.status === filter.status);
    }

    // Platform filter
    if (filter.platform !== "all") {
      result = result.filter((item) => item.platform === filter.platform);
    }

    // Date range filter
    if (filter.period !== "all") {
      const now = new Date();

      result = result.filter((item) => {
        const createdAt = new Date(item.createdAt);

        switch (filter.period) {
          case "today":
            return createdAt.toDateString() === now.toDateString();

          case "last-7-days":
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return createdAt >= sevenDaysAgo;

          case "this-month":
            return (
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            );

          default:
            return true;
        }
      });
    }
    setFilterData(result);
  }, [rawData, filter]);

  const handleFilterSelected = (key: keyof IFilter, val: string) => {
    setFilter((prev: IFilter) => ({
      ...prev,
      [key]: val,
    }));
  };

  return { filterData, handleFilterSelected };
}

export default useFilterTransactionData;
