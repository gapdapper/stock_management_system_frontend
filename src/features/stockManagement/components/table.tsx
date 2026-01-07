import React, { useState, type ReactNode } from "react";
import "./table.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import Modal from "@/components/modal";
import ProductDetail from "./productDetail";
import type { IProductData } from "@/app/types/product";
import { getProductStatus } from "@/utils/product";

type TableProps = {
  data?: IProductData[];
};

export default function Table({ data }: TableProps) {
  const [selectedProduct, setSelectedProduct] = useState<{
    name: string;
    size: string;
    color: string;
    stock: number;
    minStock: number;
  } | null>(null);

  const handleEdit = (
    productName: string,
    size: string,
    color: string,
    stock: number,
    minStock: number
  ) => {
    setSelectedProduct({
      name: productName,
      size,
      color,
      stock,
      minStock,
    });
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
            {data && data.map((item) => (
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
                                        <td>{s.color}</td>
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
                                              handleEdit(
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
        onConfirm={() => {}}
        size="modal-lg"
      >
        {selectedProduct && (
          <ProductDetail
            name={selectedProduct.name}
            size={selectedProduct.size}
            color={selectedProduct.color}
            stock={selectedProduct.stock}
            minStock={selectedProduct.minStock}
          />
        )}
      </Modal>
    </>
  );
}
