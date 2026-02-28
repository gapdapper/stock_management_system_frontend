import Table from "@/features/StockManagement/components/Table";
import { getProductsWithVariant } from "@/features/StockManagement/api/getProductWithVariant";
import { useEffect, useMemo, useState } from "react";
import type { IProductData, IWaitingProduct } from "../types/product";
import { getProductStatus } from "@/utils/product";
import LoadingSpinner from "@/components/loadingSpinner";
import Toast, { showToast } from "@/components/toast";
import { restockProduct } from "@/features/StockManagement/api/restockProduct";
import Modal from "@/components/modal";
import ReStockItem from "@/features/StockManagement/components/ReStockItem";
import "@/features/stockManagement/StockManagement.scss"

function StockManagement() {
  const [rawData, setRawData] = useState<IProductData[]>([]);
  const [sortField, setSortField] = useState<keyof IProductData>("productName");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [filter, setFilter] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [resetKey, setResetKey] = useState<number>(0);
  const [waitingList, setwaitingList] = useState<IWaitingProduct[]>([]);
  
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

  const onRefresh = async () => {
    return (await fetchProductData()) as IProductData[];
  };

  useEffect(() => {
    fetchProductData();
  }, []);

  const sortedData = useMemo(() => {
    let data = [...rawData];
    if (filter.trim()) {
      const keyword = filter.trim().toLowerCase();
      data = data.filter((item) =>
        item.productName.toLowerCase().includes(keyword),
      );
    }
    return data.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      } else if (typeof aVal === "number" && typeof bVal === "number") {
        return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
      }

      return 0;
    });
  }, [rawData, sortField, sortDirection, filter]);


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
      onRefresh();
    } catch (error) {
      throw new Error("Failed to restock the product: " + error);
    }
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
        <div className="stock-header">
          <h1 className="stock-title">Stock Management</h1>

          <div className="header-actions">
            <div className="search-box">
              <input
                type="text"
                value={filter}
                placeholder="Search by product name"
                onChange={(e) => setFilter(e.target.value)}
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
          data={sortedData}
          onRefresh={onRefresh}
          currentSortDirection={sortDirection}
          onSort={(payload) => {
            setSortField(payload.field);
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
          }}
        />
      </>
    );
  }
}

export default StockManagement;
