import OverviewStats from "@/features/Dashboard/components/OverviewStats";
import BarChartSection from "@/features/Dashboard/components/BarChartSection";
import SalesBreakdownDonut from "@/features/Dashboard/components/SalesBreakdownDonut";
import LoadingSpinner from "@/components/LoadingSpinner";
import "@/features/Dashboard/Dashboard.scss";
import Toast from "@/components/Toast";
import useFetchAvailableMonth from "@/features/Dashboard/hooks/useFetchAvailableMonth";
import useDashboardData from "@/features/Dashboard/hooks/useDashboardData";

export default function Dashboard() {
  const { selectedMonth, isLoadingMonths, formattedMonth, handleMonthChange } =
    useFetchAvailableMonth();

  const {
    rawData,
    dateRange,
    isLoadingDashboard,
    salesByStatus,
    salesByPlatform,
    topItems,
    currentMonth,
  } = useDashboardData(selectedMonth);

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
        <Toast />
      </div>
    );
  }
}
