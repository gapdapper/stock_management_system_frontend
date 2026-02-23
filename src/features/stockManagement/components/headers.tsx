import "./headers.scss";
import Modal from "@/components/modal";
import ReStockItem from "./reStockItem";
import type { IProductData, IWaitingProduct } from "@/app/types/product";
import { useState } from "react";
import { restockProduct } from "../api/restockProduct";
import Toast, { showToast } from "@/components/toast";

type HeadersProps = {
  filterVal?: string;
  setFilterVal: (val: string) => void;
  data?: IProductData[];
  onRefresh: () => void;
};

export default function Headers({
  filterVal,
  setFilterVal,
  data,
  onRefresh,
}: HeadersProps) {
  const [resetKey, setResetKey] = useState<number>(0);
  const [waitingList, setwaitingList] = useState<IWaitingProduct[]>([]);

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

  return (
    <>
      <div className="stock-header">
        <h1 className="stock-title">Stock Management</h1>

        <div className="header-actions">
          <div className="search-box">
            <input
              type="text"
              value={filterVal}
              placeholder="Search by product name"
              onChange={(e) => setFilterVal(e.target.value)}
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
          data={data}
          key={resetKey}
          onCloseConditon={setwaitingList}
        />
      </Modal>
      <Toast />
    </>
  );
}
