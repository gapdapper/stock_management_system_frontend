import Table from "@/features/StockManagement/components/Table";
import { getProductsWithVariant } from "@/features/StockManagement/api/StockManagementService";
import { useEffect, useMemo, useRef, useState } from "react";
import type { IProductData } from "@/types/product";
import { getProductStatus } from "@/utils/product";
import LoadingSpinner from "@/components/LoadingSpinner";
import Toast from "@/components/Toast";
import "@/features/StockManagement/StockManagement.scss";
import { useNavigate } from "react-router";

function StockManagement() {
  const [rawData, setRawData] = useState<IProductData[]>([]);
  const [sortField, setSortField] = useState<keyof IProductData>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const headerRef = useRef<HTMLDivElement>(null);
  let navigate = useNavigate();

  // #region data fetching
  const fetchProductData = async () => {
    try {
      const data = await getProductsWithVariant();
      const mappedData = data.products.map((product: IProductData) => {
        return { ...product, status: getProductStatus(product.variants) };
      });
      setRawData(mappedData);
      return mappedData;
    } catch (error) {
      console.error("Failed to fetch product data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
  }, []);
  // #endregion

  // #region sort&filter
  const filteredData = useMemo(() => {
    if (!filter.trim()) return rawData;

    const keyword = filter.trim().toLowerCase();
    return rawData.filter((item) =>
      item.productName.toLowerCase().includes(keyword),
    );
  }, [rawData, filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const sortedData = useMemo(() => {
    const data = [...filteredData];

    return data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal, undefined, { numeric: true, sensitivity: "base" })
          : bVal.localeCompare(aVal, undefined, { numeric: true, sensitivity: "base" });
      }

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [filteredData, sortField, sortDirection]);

  const handleSortChange = (field: keyof IProductData) => {
    if (field === sortField) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleFilterChange = (value: string) => {
    setFilter(value);
  };
  // #endregion

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
              onClick={() => {navigate('/restock')}}
            >
              Restock
            </button>
          </div>
        </div>
        <Toast />
        <Table
          data={paginatedData}
          onRefresh={fetchProductData}
          currentSortDirection={sortDirection}
          onSort={(field: keyof IProductData) => {
            handleSortChange(field)
          }}
        />
        {paginatedData.length > 0 && <div className="pagination-minimal d-flex justify-content-start align-items-center gap-2 mt-4 mb-4">
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
        </div>}
        
      </>
    );
  }
}

export default StockManagement;
