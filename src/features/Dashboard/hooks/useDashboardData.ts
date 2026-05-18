import type {
  IChartData,
  IDashboardOverview,
  IDateRange,
} from "@/types/dashboard";
import { normalizeDonutData } from "@/utils/dashboard";
import { useEffect, useState } from "react";
import { getDashboardOverview } from "../api/DashboardService";
import { showToast } from "@/components/Toast";

function useDashboardData(selectedMonth: string) {
  const [rawData, setRawData] = useState<IDashboardOverview | null>(null);
  const [dateRange, setDateRange] = useState<IDateRange | null>(null);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);

  const salesByStatus: IChartData[] = rawData
    ? normalizeDonutData(rawData.salesByStatus, "status", "count")
    : [];
  const salesByPlatform: IChartData[] = rawData
    ? normalizeDonutData(rawData.salesByPlatform, "platform", "total")
    : [];
  const topItems: IChartData[] = rawData
    ? normalizeDonutData(rawData.topItems, "productName", "totalSold")
    : [];
  const currentMonth = selectedMonth
    ? new Date(selectedMonth + "-01").toLocaleString("en-US", { month: "long" })
    : new Date().toLocaleString("en-US", { month: "long" });

  const fetchDashboardData = async (month: string) => {
    try {
      setIsLoadingDashboard(true);
      const dashboardData = await getDashboardOverview(month);
      setRawData(dashboardData);
    } catch (error) {
      showToast("Unable to load sales data. Please try again later.", "error");
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  useEffect(() => {
    if (!selectedMonth) return;
    fetchDashboardData(selectedMonth);
    updatePeriod(selectedMonth);
  }, [selectedMonth]);

  const updatePeriod = (month: string) => {
    const today = new Date();
    const [year, monthNum] = month.split("-");
    const start = new Date(`${year}-${monthNum}-1`);
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

  return {
    rawData,
    dateRange,
    isLoadingDashboard,
    salesByStatus,
    salesByPlatform,
    topItems,
    currentMonth,
  };
}

export default useDashboardData;
