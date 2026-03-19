import { useEffect, useState } from "react";
import SummaryCard from "./SummaryCard";
import type { ITransactions } from "@/types/transaction";
import LoadingSpinner from "@/components/LoadingSpinner";
import { getTransactionByOrderId } from "@/features/SalesTracker/api/SalesTrackerService";
import { useNavigate, useParams } from "react-router";
import ItemTable from "./ItemTable";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import "./SalesDetail.scss";

export default function SalesDetail() {
  const [rawData, setRawData] = useState<ITransactions | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  let params = useParams();

    let navigate = useNavigate();

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
      <div className="sales-detail-container">
      <h3 className="sales-details-header"><span className="breadcrumb-link" onClick={() => navigate("/sales")}>Sales Tracker</span> <FontAwesomeIcon icon={faAngleRight} className="breadcrumb-seperator"/> {rawData?.orderId}</h3>
        {rawData && <SummaryCard data={rawData} />}
        {rawData && rawData.items && <ItemTable data={rawData.items} />}
      </div>
    );
  }
}
