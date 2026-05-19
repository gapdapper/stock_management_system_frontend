import LoadingSpinner from "@/components/LoadingSpinner";
import Table from "@/features/SalesTracker/components/Table";
import { useRef } from "react";
import "@/features/SalesTracker/SalesTracker.scss";
import useFetchTransactionData from "@/features/SalesTracker/hooks/useFetchTransactionData";
import useFilterTransactionData from "@/features/SalesTracker/hooks/useFilterTransactionData";
import usePagination from "@/hooks/usePagination";

export default function SalesRecord() {
  const headerRef = useRef<HTMLDivElement>(null);

  const { rawData, isLoading } = useFetchTransactionData();

  const { filterData, handleFilterSelected } =
    useFilterTransactionData(rawData);

  const { paginatedData, totalPages, currentPage, goToPage } = usePagination(
    filterData,
    headerRef,
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center mt-5 pt-5">
        <LoadingSpinner />
      </div>
    );
  } else {
    return (
      <div ref={headerRef} className="sales-tracker-container">
        <div className="headers mb-3">
          <div className="d-flex justify-content-between align-items-start align-items-md-center gap-3 flex-column flex-md-row">
            <h1 className="stock-title">Sales Tracker</h1>
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
      </div>
    );
  }
}
