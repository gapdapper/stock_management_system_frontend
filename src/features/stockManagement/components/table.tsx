import React, { useState } from "react";
import "./table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEllipsis,
  faChevronDown,
  faSort,
  faArrowDownAZ,
  faArrowDownZA,
  faArrowDown19,
  faArrowDown91,
} from "@fortawesome/free-solid-svg-icons";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import Modal from "@/components/modal";
import ProductDetail from "./productDetail";
import type { IProductData } from "@/app/types/product";
import { editProductVariant } from "../api/editProductVariant";

type SortPayload = {
  field: keyof IProductData;
};

type TableProps = {
  data?: IProductData[];
  onRefresh: () => void;
  onSort: (payload: SortPayload) => void;
  currentSortDirection: string;
};

export default function Table({ data, onRefresh, onSort, currentSortDirection }: TableProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [sortedCol, setSortedCol] = useState<keyof IProductData>("productName");

  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    name: string;
    size: string;
    color: string;
    qty: number;
    minStock: number;
  } | null>(null);

  const handleEditModal = (
    variantId: number,
    productName: string,
    size: string,
    color: string,
    qty: number,
    minStock: number
  ) => {
    setSelectedProduct({
      id: variantId,
      name: productName,
      size,
      color,
      qty,
      minStock,
    });
  };

  const handleEdit = async () => {
    if (!selectedProduct) return;

    try {
      await editProductVariant({
        id: selectedProduct.id,
        qty: selectedProduct.qty,
        minStock: selectedProduct.minStock,
      });

      onRefresh();
    } catch (error) {
      console.error("Edit product variant failed", error);
    }
  };

  return (
    <>
      <div className="table-responsive-xxl">
        <table className="table">
          <thead>
            <tr>
              <th
                className={`head-col ${
                  sortedCol === "productName" ? "head-active" : ""
                }`}
                onClick={() => {
                  setSortedCol("productName");
                  onSort({ field: "productName" });
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
                className={`head-col ${
                  sortedCol === "totalStock" ? "head-active" : ""
                }`}
                onClick={() => {
                  setSortedCol("totalStock");
                  onSort({ field: "totalStock" });
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
                className={`head-col ${
                  sortedCol === "lastUpdated" ? "head-active" : ""
                }`}
                onClick={() => {
                  setSortedCol("lastUpdated");
                  onSort({ field: "lastUpdated" });
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
                className={`head-col ${
                  sortedCol === "status" ? "head-active" : ""
                }`}
                onClick={() => {
                  setSortedCol("status");
                  onSort({ field: "status" });
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
                  <tr>
                    <td>{item.productName}</td>
                    <td>{item.totalStock}</td>
                    <td>{new Date(item.lastUpdated).toLocaleString()}</td>
                    <td>
                      <span
                        className={
                          item.status === "In-stock"
                            ? "badge rounded-pill text-bg-success"
                            : "badge rounded-pill text-bg-danger"
                        }
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
                                <PlaceHolder />
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
                                              className={`badge color-badge color-${s.color
                                                .toLowerCase()
                                                .replace(" ", "-")}`}
                                            >
                                              {s.color}
                                            </span>
                                          </td>
                                          <td>{s.stock}</td>
                                          <td>{s.minStock}</td>
                                          <td>
                                            <span
                                              className={
                                                s.stock >= s.minStock
                                                  ? "badge rounded-pill text-bg-success"
                                                  : "badge rounded-pill text-bg-danger"
                                              }
                                            >
                                              {s.stock >= s.minStock
                                                ? "In-stock"
                                                : "Low stock"}
                                            </span>
                                          </td>
                                          <td>
                                            <button
                                              type="button"
                                              data-bs-toggle="modal"
                                              data-bs-target="#modal-product-detail"
                                              onClick={() =>
                                                handleEditModal(
                                                  s.variantId,
                                                  item.productName,
                                                  v.size,
                                                  s.color,
                                                  s.stock,
                                                  s.minStock
                                                )
                                              }
                                            >
                                              <FontAwesomeIcon
                                                icon={faEllipsis}
                                              />
                                            </button>
                                          </td>
                                        </tr>
                                      ))
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
      </div>
      <Modal
        id="product-detail"
        title="Product Details"
        confirmText="Edit"
        cancelText="Cancel"
        onConfirm={handleEdit}
        confirmDisabled={!isDirty}
        size="modal-lg"
      >
        {selectedProduct && (
          <ProductDetail
            data={selectedProduct}
            formHandler={setSelectedProduct}
            onDirtyChange={setIsDirty}
          />
        )}
      </Modal>
    </>
  );
}
