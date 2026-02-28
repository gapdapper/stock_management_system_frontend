import OverviewStats from "@/features/dashboard/components/OverviewStats";
import BarChartSection from "@/features/dashboard/components/BarChartSection";
import SalesBreakdownDonut from "@/features/dashboard/components/SalesBreakdownDonut";
import { getDashboardOverview } from "@/features/dashboard/api/getDashboardOverview";
import { getAvailableMonths } from "@/features/dashboard/api/getAvailableMonths";
import type {
  IChartData,
  IDashboardOverview,
  IDateRange,
} from "../types/dashboard";
import { useEffect, useState } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { normalizeDonutData } from "@/utils/dashboard";
import "@/features/dashboard/Dashboard.scss";

export default function Dashboard() {
  const [rawData, setRawData] = useState<IDashboardOverview | null>(null);
  const [topItems, setTopItems] = useState<IChartData[]>([]);
  const [salesByStatus, setSalesByStatus] = useState<IChartData[]>([]);
  const [salesByPlatform, setSalesByPlatform] = useState<IChartData[]>([]);
  const [dateRange, setDateRange] = useState<IDateRange | null>(null);
  const [currentMonth, setcurrentMonth] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [availableMonth, setAvailableMonth] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [formattedMonth, setFormattedMonth] = useState<
    { val: string; display: string }[]
  >([]);

  const fetchDashboardData = async (month: string) => {
    try {
      const dashboardData = await getDashboardOverview(month);
      setRawData(dashboardData);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAvailableMonthsData = async () => {
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
    // fetchDashboardData(formattedMonth);
    fetchAvailableMonthsData();

    // const monthName = currentDate.toLocaleString("en-US", {
    //   month: "long",
    // });
    // setcurrentMonth(monthName);
    // updatePeriod(formattedMonth);
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
    setChartData(rawData);
  }, [rawData]);

  const setChartData = (data: IDashboardOverview) => {
    if (!data) return;

    if (data.salesByStatus) {
      setSalesByStatus(
        normalizeDonutData(data.salesByStatus, "status", "count"),
      );
    }

    if (data.salesByPlatform) {
      setSalesByPlatform(
        normalizeDonutData(data.salesByPlatform, "platform", "total"),
      );
    }

    if (data.topItems) {
      setTopItems(
        normalizeDonutData(data.topItems, "productName", "totalSold"),
      );
    }
  };

  const refreshDashboard = (month: string) => {
    fetchDashboardData(month);
    updatePeriod(month);
    const [year, monthVal] = month.split("-").map((val) => Number(val));
    const newDate = new Date(year, monthVal - 1);
    const monthName = newDate.toLocaleString("en-US", {
      month: "long",
    });
    setcurrentMonth(monthName);
  };

  useEffect(() => {
    if (!availableMonth.length) {
      const today = new Date();
      const val = `${today.getFullYear()}-${today.getMonth()}`;
      const display = `${today.toLocaleString("default", { month: "long" })} - ${today.getFullYear()}`;
      setFormattedMonth([{ val: val, display: display }]);
    } else {
      let isIncludedCurrentMonth = false;
      const today = new Date();
      let formatted = availableMonth.map((monthStr) => {
        const [year, month] = monthStr.split("-").map((val) => Number(val));
        const newDate = new Date(year, month - 1);
        if (year == today.getFullYear() && month == today.getMonth() + 1)
          isIncludedCurrentMonth = true;
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
      formatted.sort((a, b) => {
        const dateA = new Date(a.val + "-01");
        const dateB = new Date(b.val + "-01");
        return dateB.getTime() - dateA.getTime();
      });
      setFormattedMonth(formatted);
      if (formatted.length > 0) {
        setSelectedMonth(formatted[0].val);
      }
    }
  }, [availableMonth]);

  useEffect(() => {
    if (!selectedMonth) return;

    fetchDashboardData(selectedMonth);
    updatePeriod(selectedMonth);

    const [year, monthVal] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, monthVal - 1);

    setcurrentMonth(newDate.toLocaleString("en-US", { month: "long" }));
  }, [selectedMonth]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5 pt-5">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <>
        <div className="dashboard-header mb-3 d-flex justify-content-between">
          <h1 className="dashboard-title">Dashboard - {currentMonth}</h1>
          <div className="dashboard-input align-self-center">
            <select
              name="date-range-filter"
              id="date-range-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {formattedMonth.length &&
                formattedMonth.map((month) => {
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
              dateRange={dateRange!}
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
      </>
    );
  }
}
