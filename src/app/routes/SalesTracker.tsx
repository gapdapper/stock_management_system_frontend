import LoadingSpinner from "@/components/loadingSpinner";
import Table from "@/features/SalesTracker/components/Table";
import { useEffect, useState } from "react";
import type { IFilter, ITransactions } from "@/types/transaction";
import { getTransactions } from "@/features/SalesTracker/api/SalesTrackerService";

export default function SalesRecord() {
  const [rawData, setRawData] = useState<ITransactions[]>([]);
  const [filterData, setFilterData] = useState<ITransactions[]>([]);
  const [filter, setFilter] = useState<IFilter>({
    platform: "all",
    status: "all",
    period: "all",
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const ITEMS_PER_PAGE = 20;

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedData = filterData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const fetchTransactionsData = async () => {
    try {
      const data = await getTransactions();
      setRawData(data);
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
      setCurrentPage(1);
    }
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  useEffect(() => {
    let result = [...rawData];

    // Status filter
    if (filter.status !== "all") {
      result = result.filter((item) => item.status === filter.status);
    }

    // Platform filter
    if (filter.platform !== "all") {
      result = result.filter((item) => item.platform === filter.platform);
    }

    // Date range filter
    if (filter.period !== "all") {
      const now = new Date();

      result = result.filter((item) => {
        const createdAt = new Date(item.createdAt);

        switch (filter.period) {
          case "today":
            return createdAt.toDateString() === now.toDateString();

          case "last-7-days":
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return createdAt >= sevenDaysAgo;

          case "this-month":
            return (
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            );

          default:
            return true;
        }
      });
    }
    setFilterData(result);
    setTotalPages(Math.ceil(result.length / ITEMS_PER_PAGE));
  }, [rawData, filter]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFilterSelected = (key: keyof IFilter, val: string) => {
    setFilter((prev: IFilter) => ({
      ...prev,
      [key]: val,
    }));
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
        <div className="headers mb-3">
          <div className="d-flex justify-content-between align-items-start align-items-md-center gap-3 flex-column flex-md-row">
            <h1 className="stock-title">Sales</h1>
            <div className="filter-section d-flex gap-2 flex-wrap">
              <select
                name="status-filter"
                id="status-filter"
                onChange={(e) => handleFilterSelected("status", e.target.value)}
                defaultValue="all"
              >
                <option value="all">All Statuses</option>
                <option value="order placed">Order Placed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="returned">Returned</option>
                <option value="cancelled">Cancelled</option>
                <option value="completed">Completed</option>
              </select>

              <select
                name="platform-filter"
                id="platform-filter"
                onChange={(e) =>
                  handleFilterSelected("platform", e.target.value)
                }
                defaultValue="all"
              >
                <option value="all">All Platforms</option>
                <option value="Shopee">Shopee</option>
                <option value="Lazada">Lazada</option>
                <option value="TikTok Shop">TikTok Shop</option>
              </select>

              <select
                name="date-range-filter"
                id="date-range-filter"
                onChange={(e) => handleFilterSelected("period", e.target.value)}
                defaultValue="all"
              >
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="last-7-days">Last 7 Days</option>
                <option value="this-month">This Month</option>
              </select>
            </div>
          </div>
        </div>
        <Table data={paginatedData} />
        {paginatedData.length > 0 && (
          <div className="pagination-minimal d-flex justify-content-start align-items-center gap-2 mt-4 mb-4">
            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
            >
              ← Prev
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const page = idx + 1;
              const isActive = page === currentPage;

              return (
                <button
                  key={page}
                  className={`btn btn-sm ${
                    isActive ? "btn-dark" : "btn-outline-secondary"
                  }`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="btn btn-sm btn-outline-secondary"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
            >
              Next →
            </button>
          </div>
        )}
      </>
    );
  }
}
