import { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import type { ITransactions } from "@/app/types/transaction";
import LoadingSpinner from "@/components/loadingSpinner";
import { getTransactionByOrderId } from "@/features/salesRecord/api/getTransactions";
import { useParams } from "react-router";
import ItemTable from "./ItemTable";

export default function SalesDetail() {
  const [rawData, setRawData] = useState<ITransactions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let params = useParams();

  const fetchTransactionData = async () => {
    try {
      if (!params || !params.id) return;
      const data = await getTransactionByOrderId(params.id);
      setRawData(data);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactionData();
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
        {rawData && <SummaryCard data={rawData} />}
        {rawData && rawData.items && <ItemTable data={rawData.items} />}
      </>
    );
  }
}
