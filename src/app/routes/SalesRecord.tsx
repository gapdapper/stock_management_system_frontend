import LoadingSpinner from "@/components/loadingSpinner";
import Headers from "@/features/salesRecord/components/Headers";
import Table from "@/features/salesRecord/components/Table";
import { useEffect, useState } from "react";
import type { IFilter, ITransactions } from "../types/transaction";
import { getTransactions } from "@/features/salesRecord/api/getTransactions";

export default function SalesRecord() {
  const [rawData, setRawData] = useState<ITransactions[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    platform: "all",
    status: "all",
    period: "all",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProductData = async () => {
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
    fetchProductData();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5 pt-5">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <Headers filterSetter={setFilter} />
        <Table data={rawData} filter={filter}/>
      </>
    );
  }
}
