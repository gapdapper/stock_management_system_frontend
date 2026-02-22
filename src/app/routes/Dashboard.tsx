import Headers from "@/features/dashboard/components/headers";
import OverviewStats from "@/features/stockManagement/components/overviewStats";
import BarChartSection from "@/features/dashboard/components/barChartSection";
import SalesBreakdownDonut from "@/features/dashboard/components/salesBreakdownDonut";
import { getDashboardOverview } from "@/features/dashboard/api/getDashboardOverview";
import { getAvailableMonths } from "@/features/dashboard/api/getAvailableMonths";
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
  const [availableMonth, setAvailableMonth] = useState<string[]>([]);

  const fetchProductData = async (month: string) => {
    try {
      const dashboardData = await getDashboardOverview(month);
      setRawData(dashboardData);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvaialableMonthsData = async () => {
    try {
      const availableMonthData = await getAvailableMonths();
      setAvailableMonth(availableMonthData);
    } catch (error) {
      console.error("Failed to fetch available months data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    const formattedMonth = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}`;
    fetchProductData(formattedMonth);
    fetchAvaialableMonthsData();

    const monthName = currentDate.toLocaleString("en-US", {
      month: "long",
    });
    setcurrentMonth(monthName);
    updatePeriod(formattedMonth);
  }, []);

  const updatePeriod = (month: string) => {
    const today = new Date();
    const splittedMonth = month.split("-");
    const start = new Date(`${splittedMonth[0]}-${splittedMonth[1]}-1`);
    const currentMonthRange = {
      start: start,
      end:
        today.getMonth() == start.getMonth() &&
        today.getFullYear() == start.getFullYear()
          ? today
          : new Date(start.getFullYear(), start.getMonth() + 1, 0),
    };
    setDateRange(currentMonthRange);
  };

  useEffect(() => {
    if (!rawData) return;

    if (rawData.salesByStatus) {
      setSalesByStatus(
        normalizeDonutData(rawData.salesByStatus, "status", "count"),
      );
    }

    if (rawData.salesByPlatform) {
      setSalesByPlatform(
        normalizeDonutData(rawData.salesByPlatform, "platform", "total"),
      );
    }

    if (rawData.topItems) {
      setTopItems(
        normalizeDonutData(rawData.topItems, "productName", "totalSold"),
      );
      console.log(rawData.topItems);
    }
  }, [rawData]);

  const refreshDashboard = (month: string) => {
    fetchProductData(month);
    updatePeriod(month);
  };

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
          currentMonth={currentMonth}
          availableMonths={availableMonth}
          onRefresh={refreshDashboard}
        />
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
            <h4>Top 5 Highest Sold Item</h4>
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
