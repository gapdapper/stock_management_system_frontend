import Table from "@/features/StockManagement/components/Table";
import { getProductsWithVariant, restockProduct } from "@/features/StockManagement/api/StockManagementService";
import { useEffect, useMemo, useState } from "react";
import type { IProductData, IWaitingProduct } from "@/types/product";
import { getProductStatus } from "@/utils/product";
import LoadingSpinner from "@/components/loadingSpinner";
import Toast, { showToast } from "@/components/Toast";
import Modal from "@/components/Modal";
import ReStockItem from "@/features/StockManagement/components/ReStockItem";
import "@/features/stockManagement/StockManagement.scss";

function StockManagement() {
  const [rawData, setRawData] = useState<IProductData[]>([]);
  const [sortField, setSortField] = useState<keyof IProductData>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState<number>(0);
  const [waitingList, setwaitingList] = useState<IWaitingProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;

  // #region data fetching
  const fetchProductData = async () => {
    try {
      const data = await getProductsWithVariant();
      const mappedData = data.products.map((product) => {
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
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
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
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return sortedData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [sortedData, currentPage]);

  const restockItem = async () => {
    const payload = {
      items: waitingList.map((item) => ({
        variantId: item.variantId,
        qty: item.stock,
      })),
    };
    try {
      showToast("Restock Success!", "success");
      await restockProduct(payload);
      fetchProductData();
    } catch (error) {
      throw new Error("Failed to restock the product: " + error);
    }
  };
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
        <div className="stock-header">
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
              data-bs-toggle="modal"
              data-bs-target="#modal-restock-items"
            >
              + Re-stock
            </button>
          </div>
        </div>

        <Modal
          id="restock-items"
          title="Re-stock Items"
          confirmText="Confirm"
          cancelText="Cancel"
          onConfirm={restockItem}
          confirmDisabled={waitingList.length == 0}
          onClose={() => setResetKey((k) => k + 1)}
          size="modal-lg"
        >
          <ReStockItem
            data={rawData}
            key={resetKey}
            onCloseConditon={setwaitingList}
          />
        </Modal>
        <Toast />
        <Table
          data={paginatedData}
          onRefresh={fetchProductData}
          currentSortDirection={sortDirection}
          onSort={(field) => {
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
