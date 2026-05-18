import Table from "@/features/StockManagement/components/Table";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IProductData } from "@/types/product";
import LoadingSpinner from "@/components/LoadingSpinner";
import "@/features/StockManagement/StockManagement.scss";
import { useNavigate } from "react-router";
import useFetchStockData from "@/features/StockManagement/hooks/useFetchStockData";
import useStockTableControls from "@/features/StockManagement/hooks/useStockTableControls";

function StockManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const headerRef = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();

  const { rawData, isLoading, fetchProductData } = useFetchStockData();

  const {
    filter,
    sortDirection,
    filteredData,
    sortedData,
    handleFilterChange,
    handleSortChange,
  } = useStockTableControls(rawData);


  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  // #region pagination
  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  const scrollToHeader = () => {
    const header = headerRef.current;
    const container = document.querySelector("main");

    if (header && container) {
      container.scrollTo({
        top: header.offsetTop - 24,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToHeader();
  }, [currentPage]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  // #endregion

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
