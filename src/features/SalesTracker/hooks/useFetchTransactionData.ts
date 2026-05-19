import type { ITransactions } from "@/types/transaction";
import { useEffect, useState } from "react";
import { getTransactions } from "../api/SalesTrackerService";

function useFetchTransactionData() {
  const [rawData, setRawData] = useState<ITransactions[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchTransactionsData = async () => {
    try {
      const data = await getTransactions();
      setRawData(data);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  return { rawData, isLoading };
}

export default useFetchTransactionData;
