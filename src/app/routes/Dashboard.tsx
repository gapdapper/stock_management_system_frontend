import OverviewStats from "@/features/dashboard/components/overviewStats";
import BarChartSection from "@/features/dashboard/components/barChartSection";
import SalesBreakdownDonut from "@/features/dashboard/components/salesBreakdownDonut";
import {
  getAvailableMonths,
  getDashboardOverview,
} from "@/features/dashboard/api/DashboardService";
import type {
  IChartData,
  IDashboardOverview,
  IDateRange,
  IMonthOption,
} from "@/types/dashboard";
import { useEffect, useMemo, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { normalizeDonutData } from "@/utils/dashboard";
import "@/features/dashboard/Dashboard.scss";

export default function Dashboard() {
  // states
  const [rawData, setRawData] = useState<IDashboardOverview | null>(null);
  const [dateRange, setDateRange] = useState<IDateRange | null>(null);
  const [isLoadingMonths, setIsLoadingMonths] = useState<boolean>(true);
  const [isLoadingDashboard, setIsLoadingDashboard] = useState<boolean>(true);
  const [availableMonth, setAvailableMonth] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");

  // derived states
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

  // #region data fetching
  const fetchDashboardData = async (month: string) => {
    try {
      setIsLoadingDashboard(true);
      const dashboardData = await getDashboardOverview(month);
      setRawData(dashboardData);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoadingDashboard(false);
    }
  };

  const fetchAvailableMonthsData = async () => {
    try {
      const availableMonthData = await getAvailableMonths();
      setAvailableMonth(availableMonthData);
    } catch (error) {
      console.error("Failed to fetch available months data");
    } finally {
      setIsLoadingMonths(false);
    }
  };

  useEffect(() => {
    fetchAvailableMonthsData();
  }, []);

  const formattedMonth: IMonthOption[] = useMemo(() => {
    let isIncludedCurrentMonth = false;
    const today = new Date();
    let formatted = availableMonth.map((monthStr) => {
      const [year, month] = monthStr.split("-").map((val) => Number(val));
      const newDate = new Date(year, month - 1);
      if (year == today.getFullYear() && month == today.getMonth() + 1) {
        isIncludedCurrentMonth = true;
      }
      return {
        val: monthStr,
        display: `${newDate.toLocaleString("default", { month: "long" })} - ${newDate.getFullYear()}`,
      };
    });

    if (!isIncludedCurrentMonth) {
      formatted.push({
        val: `${today.getFullYear()}-${today.getMonth() + 1}`,
        display: `${today.toLocaleString("default", { month: "long" })} - ${today.getFullYear()}`,
      });
    }

    return formatted.sort((a, b) => {
      const dateA = new Date(a.val + "-01");
      const dateB = new Date(b.val + "-01");
      return dateB.getTime() - dateA.getTime();
    });
  }, [availableMonth]);

  useEffect(() => {
    if (!formattedMonth.length) return;
    handleMonthChange(formattedMonth[0].val);
  }, [formattedMonth]);

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

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };

  if (isLoadingDashboard || isLoadingMonths) {
    return (
      <div className="d-flex justify-content-center mt-5 pt-5">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div className="dashboard-container">
        <div className="dashboard-header d-flex justify-content-between">
          <h1 className="dashboard-title">Dashboard - {currentMonth}</h1>
          <div className="dashboard-input align-self-center">
            <select
              name="date-range-filter"
              id="date-range-filter"
              className="date-range-filter"
              value={selectedMonth}
              onChange={(e) => handleMonthChange(e.target.value)}
            >
              {formattedMonth.map((month) => {
                return (
                  <option key={month.val} value={month.val}>
                    {month.display}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-6 mb-4">
            <OverviewStats
              totalOrder={rawData?.totalOrders}
              unitSold={rawData?.unitsSold}
              avgItems={rawData?.avgItemsPerOrder}
              dateRange={dateRange ?? { start: new Date(), end: new Date() }}
            />
          </div>

          <div className="col-6">
            <div className="mb-4 shadow-sm p-3 rounded bg-white">
              <h4>Top 5 Highest Sold Item</h4>
              <BarChartSection data={topItems} />
            </div>
          </div>
          <div className="col-6">
            <div className="shadow-sm p-3 rounded bg-white">
              <h4>Sales Breakdown by Status</h4>
              <SalesBreakdownDonut
                data={salesByStatus}
                centerLabel="Top Status"
              />
            </div>
          </div>
          <div className="col-6">
            <div className="shadow-sm p-3 rounded bg-white">
              <h4>Sales Breakdown by Platform</h4>
              <SalesBreakdownDonut
                data={salesByPlatform}
                centerLabel="Top Platform"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
