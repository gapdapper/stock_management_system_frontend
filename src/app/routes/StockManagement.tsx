import Table from "@/features/StockManagement/components/Table";
import { useRef } from "react";
import type { IProductData } from "@/types/product";
import LoadingSpinner from "@/components/LoadingSpinner";
import "@/features/StockManagement/StockManagement.scss";
import { useNavigate } from "react-router";
import useFetchStockData from "@/features/StockManagement/hooks/useFetchStockData";
import useStockTableControls from "@/features/StockManagement/hooks/useStockTableControls";
import usePagination from "@/hooks/usePagination";

function StockManagement() {
  const headerRef = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();

  const { rawData, isLoading, fetchProductData } = useFetchStockData();

  const {
    filter,
    sortDirection,
    sortedData,
    handleFilterChange,
    handleSortChange,
  } = useStockTableControls(rawData);

  const { paginatedData, totalPages, currentPage, goToPage } = usePagination(
    sortedData,
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
      <>
        <div ref={headerRef} className="stock-header">
          <h1 className="stock-title">Stock Management</h1>
          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={filter}
                placeholder="Search by product name"
                onChange={(e) => handleFilterChange(e.target.value)}
              />
            </div>

            <button
              className="btn-restock"
              type="button"
              onClick={() => {
                navigate("/restock");
              }}
            >
              Restock
            </button>
          </div>
        </div>
        <Table
          data={paginatedData}
          onRefresh={fetchProductData}
          currentSortDirection={sortDirection}
          onSort={(field: keyof IProductData) => {
            handleSortChange(field);
          }}
        />
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

export default StockManagement;
