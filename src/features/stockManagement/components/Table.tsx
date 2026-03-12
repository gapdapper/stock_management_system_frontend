import React, { useState } from "react";
import "./Table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faChevronDown,
  faSort,
  faArrowDownAZ,
  faArrowDownZA,
  faArrowDown19,
  faArrowDown91,
  faMagnifyingGlass,
  faWrench,
} from "@fortawesome/free-solid-svg-icons";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import Modal from "@/components/Modal";
import ProductDetail from "./ProductDetail";
import type { IProductData, IProductEditModalData } from "@/types/product";
import { editProductVariant } from "../api/StockManagementService";
import Toast, { showToast } from "@/components/Toast";
import { validateFileSize } from "@/utils/product";
import { uploadProductImage } from "../api/StockManagementService";


type TableProps = {
  data?: IProductData[];
  onRefresh: () => Promise<IProductData[] | undefined>;
  onSort: (field: keyof IProductData) => void;
  currentSortDirection: string;
};

export default function Table({
  data,
  onRefresh,
  onSort,
  currentSortDirection,
}: TableProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [sortedCol, setSortedCol] = useState<keyof IProductData>("productName");
  const [selectedProduct, setSelectedProduct] =
    useState<IProductEditModalData | null>(null);

  const handleConfirmEdit = async () => {
    if (!selectedProduct) return;

    try {
      await editProductVariant({
        id: selectedProduct.variantId,
        qty: selectedProduct.qty,
        minStock: selectedProduct.minStock,
      });
      showToast("Edit Success!", "success");
      await onRefresh();
    } catch (error) {
      console.error("Edit product variant failed", error);
    }
  };

  const reloadModal = async () => {
    if (!selectedProduct) return;

    const refreshedData = await onRefresh();

    const product = refreshedData?.find(
      (p) => p.id === selectedProduct.productId,
    );

    const variant = product?.variants
      ?.find((v) => v.size === selectedProduct.size)
      ?.sub.find((s) => s.variantId === selectedProduct.variantId);

    if (!variant) return;

    setSelectedProduct((prev) =>
      prev
        ? {
            ...prev,
            variantImageUrl: variant.variantImageUrl ?? "",
          }
        : prev,
    );
  };

  const submitproductImage = async (productId: number, file: File) => {
    const validatedFile = validateFileSize(file);
    try {
      if (!validatedFile) {
        showToast(
          "The selected image exceeds the file size limit. (5 MB)",
          "error",
        );
        return;
      }
      await uploadProductImage("product", productId, validatedFile);
      showToast("Product Image Updated Successfully.", "success");
      await onRefresh();
    } catch (error) {
      console.error("Failed to update the product data.");
      showToast("Failed to update the product data.", "error");
    }
  };

  const handleProductChange = (product: IProductEditModalData) => {
    setSelectedProduct(product);
  };

  return (
    <>
      <div className="stock-table-wrapper">
        <table>
          <thead>
            <tr>
              <th
                className={`head-col`}
                onClick={() => {
                  setSortedCol("productName");
                  onSort("productName");
                }}
              >
                Product Name
                {sortedCol !== "productName" ? (
                  <FontAwesomeIcon icon={faSort} className="ms-2" />
                ) : currentSortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faArrowDownAZ} className="ms-2" />
                ) : (
                  <FontAwesomeIcon icon={faArrowDownZA} className="ms-2" />
                )}
              </th>
              <th
                className={`head-col`}
                onClick={() => {
                  setSortedCol("totalStock");
                  onSort("totalStock");
                }}
              >
                Total Stock
                {sortedCol !== "totalStock" ? (
                  <FontAwesomeIcon icon={faSort} className="ms-2" />
                ) : currentSortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faArrowDown19} className="ms-2" />
                ) : (
                  <FontAwesomeIcon icon={faArrowDown91} className="ms-2" />
                )}
              </th>
              <th
                className={`head-col`}
                onClick={() => {
                  setSortedCol("lastUpdated");
                  onSort("lastUpdated");
                }}
              >
                Last Updated
                {sortedCol !== "lastUpdated" ? (
                  <FontAwesomeIcon icon={faSort} className="ms-2" />
                ) : currentSortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faArrowDownAZ} className="ms-2" />
                ) : (
                  <FontAwesomeIcon icon={faArrowDownZA} className="ms-2" />
                )}
              </th>
              <th
                className={`head-col`}
                onClick={() => {
                  setSortedCol("status");
                  onSort("status");
                }}
              >
                Status
                {sortedCol !== "status" ? (
                  <FontAwesomeIcon icon={faSort} className="ms-2" />
                ) : currentSortDirection === "asc" ? (
                  <FontAwesomeIcon icon={faArrowDownAZ} className="ms-2" />
                ) : (
                  <FontAwesomeIcon icon={faArrowDownZA} className="ms-2" />
                )}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {data &&
              data.map((item) => (
                <React.Fragment key={item.id}>
                  {/* normal row */}
                  <tr className="hoverable">
                    <td>{item.productName}</td>
                    <td>{item.totalStock}</td>
                    <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                    <td>
                      <span
                        className={`status-badge ${item.status?.replaceAll(
                          " ",
                          "-",
                        )}`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td>
                      {item.variants && (
                        <button
                          type="button"
                          className="btn btn-sm row-collapse-btn"
                          data-bs-toggle="collapse"
                          data-bs-target={`#collapse-${item.id}`}
                          aria-expanded="false"
                          aria-controls={`collapse-${item.id}`}
                        >
                          <FontAwesomeIcon icon={faChevronDown} />
                        </button>
                      )}
                    </td>
                  </tr>

                  {/* collapsable row */}
                  {item.variants && (
                    <tr className="collapse-row">
                      <td colSpan={6} className="p-0 border-0">
                        <div className="collapse " id={`collapse-${item.id}`}>
                          <div className="collapse-inner">
                            <div className="d-flex">
                              {/* image cell */}
                              <div className="image-cell">
                                <div className="image-wrapper">
                                  {item.productImageUrl != "" ? (
                                    <img
                                      src={item.productImageUrl}
                                      alt="Product"
                                      className="product-img"
                                    />
                                  ) : (
                                    <PlaceHolder />
                                  )}
                                  <div className="image-overlay">
                                    <FontAwesomeIcon
                                      icon={faWrench}
                                      style={{ fontSize: "10px" }}
                                    />
                                  </div>

                                  <input
                                    type="file"
                                    accept="image/*"
                                    className="image-input"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        submitproductImage(item.id, file);
                                      }
                                    }}
                                  />
                                </div>
                                <p>{item.productName}</p>
                              </div>

                              {/* sub table */}
                              <div className="flex-grow-1">
                                <table className="table mb-0">
                                  <thead>
                                    <tr>
                                      <th>Size</th>
                                      <th>Color</th>
                                      <th>Stock</th>
                                      <th>Min. Stock</th>
                                      <th>Status</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody className="table-group-divider">
                                    {item.variants.map((v) =>
                                      v.sub.map((s, idx) => (
                                        <tr key={idx}>
                                          <td>{idx == 0 ? v.size : ""}</td>
                                          <td className="product-color-badge">
                                            <span
                                              className={`status-badge color-${s.color
                                                .toLowerCase()
                                                .replaceAll(" ", "-")}`}
                                            >
                                              {s.color}
                                            </span>
                                          </td>
                                          <td>{s.stock}</td>
                                          <td>{s.minStock}</td>
                                          <td>
                                            <span
                                              className={`status-badge ${item.status?.replaceAll(
                                                " ",
                                                "-",
                                              )}`}
                                            >
                                              {s.stock <= s.minStock
                                                ? s.stock == 0
                                                  ? "Out of stock"
                                                  : "Low stock"
                                                : "In-stock"}
                                            </span>
                                          </td>
                                          <td>
                                            <button
                                              type="button"
                                              data-bs-toggle="modal"
                                              data-bs-target="#modal-product-detail"
                                              onClick={() =>
                                                handleProductChange({
                                                  productId: item.id,
                                                  variantId: s.variantId,
                                                  productName: item.productName,
                                                  size: v.size,
                                                  color: s.color,
                                                  qty: s.stock,
                                                  minStock: s.minStock,
                                                  variantImageUrl:
                                                    s.variantImageUrl,
                                                })
                                              }
                                            >
                                              <FontAwesomeIcon
                                                icon={faEllipsis}
                                              />
                                            </button>
                                          </td>
                                        </tr>
                                      )),
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>
        {!data?.length && (
          <div className="empty-state">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <p>No products match your search.</p>
          </div>
        )}
      </div>
      <Modal
        id="product-detail"
        title={`${selectedProduct?.productName} ${selectedProduct?.size} ${selectedProduct?.color}`}
        confirmText="Edit"
        cancelText="Cancel"
        onConfirm={handleConfirmEdit}
        confirmDisabled={!isDirty}
        size="modal-lg"
      >
        {selectedProduct && (
          <ProductDetail
            data={selectedProduct}
            formHandler={handleProductChange}
            onDirtyChange={setIsDirty}
            onRefresh={reloadModal}
          />
        )}
      </Modal>
      <Toast />
    </>
  );
}
