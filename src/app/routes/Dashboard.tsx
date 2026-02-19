import Headers from "@/features/dashboard/components/headers";
import OverviewStats from "@/features/stockManagement/components/overviewStats";
import BarChartSection from "@/features/dashboard/components/barChartSection";
import SalesBreakdownDonut from "@/features/dashboard/components/SalesBreakdownDonut";
import { getDashboardOverview } from "@/features/dashboard/api/getDashboardOverview";
import type {
  IChartData,
  IDashboardOverview,
  IDateRange,
} from "../types/dashboard";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/loadingSpinner";
import { normalizeDonutData } from "@/utils/dashboard";

export default function Dashboard() {
  const [rawData, setRawData] = useState<IDashboardOverview | null>(null);
  const [topItems, setTopItems] = useState<IChartData[]>([]);
  const [salesByStatus, setSalesByStatus] = useState<IChartData[]>([]);
  const [salesByPlatform, setSalesByPlatform] = useState<IChartData[]>([]);
  const [dateRange, setDateRange] = useState<IDateRange | null>(null);
  const [currentMonth, setcurrentMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProductData = async () => {
    try {
      const data = await getDashboardOverview();
      setRawData(data);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();

    const monthName = new Date().toLocaleString("en-US", {
      month: "long",
    });

    setcurrentMonth(monthName);

    const now = new Date();
    const currentMonthRange = {
      start: new Date(now.getFullYear(), now.getMonth(), 1),
      end: now,
    };

    setDateRange(currentMonthRange);
  }, []);

  useEffect(() => {
    if (!rawData) return;

    if (rawData.salesByStatus) {
      setSalesByStatus(
        normalizeDonutData(rawData.salesByStatus, "status", "count")
      );
    }

    if (rawData.salesByPlatform) {
      setSalesByPlatform(
        normalizeDonutData(rawData.salesByPlatform, "platform", "total")
      );
    }

    if (rawData.topItems) {
      setTopItems(
        normalizeDonutData(rawData.topItems, "productName", "totalSold")
      );
      console.log(rawData.topItems)
    }
  }, [rawData]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5 pt-5">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <Headers currentMonth={currentMonth} />
        <div className="row">
          <div className="col-6 mb-5">
            <OverviewStats
              totalOrder={rawData?.totalOrders}
              unitSold={rawData?.unitsSold}
              avgItems={rawData?.avgItemsPerOrder}
              dateRange={dateRange!}
            />
          </div>

          <div className="col-6 mb-5 shadow-sm p-3 rounded">
            <BarChartSection data={topItems} />
          </div>
          <div className="col-6 shadow-sm p-3 rounded">
            <h4>Sales Breakdown by Status</h4>
            <SalesBreakdownDonut
              data={salesByStatus}
              centerLabel="Top Status"
            />
          </div>
          <div className="col-6 shadow-sm p-3 rounded">
            <h4>Sales Breakdown by Platform</h4>
            <SalesBreakdownDonut
              data={salesByPlatform}
              centerLabel="Top Platform"
            />
          </div>
        </div>
      </>
    );
  }
}
