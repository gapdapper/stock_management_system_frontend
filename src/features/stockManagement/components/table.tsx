import React, { useState, type ReactNode } from "react";
import "./table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import Modal from "@/components/modal";
import ProductDetail from "./productDetail";
import type { IProductData } from "@/app/types/product";
import { getProductStatus } from "@/utils/product";
import { editProductVariant } from "../api/editProductVariant";

type TableProps = {
  data?: IProductData[];
  onRefresh: () => void;
};

export default function Table({ data, onRefresh }: TableProps) {
  const [isDirty, setIsDirty] = useState(false);

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
              <th>Product Name</th>
              <th>Total Stock</th>
              <th>Last Updated</th>
              <th>Status</th>
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
                          getProductStatus(item.variants) === "In-stock"
                            ? "badge rounded-pill text-bg-success"
                            : "badge rounded-pill text-bg-danger"
                        }
                      >
                        {getProductStatus(item.variants)}
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
                                      <th>Min Stock</th>
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
