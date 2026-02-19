import "./productDetail.scss";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faWrench } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useRef } from "react";

type ProductDetailProp = {
  data: any;
  formHandler: (data: any) => void;
  onDirtyChange: (data: any) => void;
};

export default function ProductDetail({
  data,
  formHandler,
  onDirtyChange,
}: ProductDetailProp) {
  const initialRef = useRef({
    qty: data.qty,
    minStock: data.minStock,
  });

  const isDirty = useMemo(() => {
    return (
      data.qty !== initialRef.current.qty ||
      data.minStock !== initialRef.current.minStock
    );
  }, [data]);

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    initialRef.current = {
      qty: data.qty,
      minStock: data.minStock,
    };
  }, [data]);

  return (
    <>
      <div className="product-detail">
        <div className="row g-4">
          <div className="col-6">
            <div className=" col-12">
              <div className="product-image">
                {data.VariantImageUrl ? (
                  <img
                    src={data.VariantImageUrl}
                    alt="Product"
                    className="product-img"
                  />
                ) : (
                  <PlaceHolder />
                )}
                <div className="image-overlay">
                  <FontAwesomeIcon icon={faWrench} size="xs" />
                </div>

                <input
                  type="file"
                  accept="image/*"
                  className="image-input"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // handle upload
                    }
                  }}
                />
              </div>
            </div>

            <div className="status-badge col-12 mt-0">
              <span
                className={
                  data.qty >= data.minStock
                    ? "status-badge in-stock"
                    : "status-badge low-stock"
                }
              >
                {data.qty >= data.minStock ? "In-stock" : "Low stock"}
              </span>
            </div>
          </div>
          <div className="col-6">
            <p>
              <strong>Product:</strong> {data.name}
            </p>
            <p>
              <strong>Size:</strong> {data.size}
            </p>
            <p>
              <strong>Color:</strong> {data.color}
            </p>
            <div className="input-form">
              <label htmlFor="stock-input">
                <strong>Stock</strong>
              </label>
              <input
                type="number"
                id="stock-input"
                className="form-control"
                placeholder="xx"
                aria-label="Stock"
                aria-describedby="basic-addon1"
                value={data.qty}
                onChange={(e) => {
                  formHandler({ ...data, qty: Number(e.target.value) });
                }}
              ></input>
              <div className="d-flex">
                <label htmlFor="minimum-stock-input">
                  <strong>Minimum Stock</strong>
                </label>
                <div className="custom-tooltip">
                  <FontAwesomeIcon icon={faCircleQuestion} />
                  <span className="custom-tooltiptext">
                    Triggers Low stock when stock falls below this value.
                  </span>
                </div>
              </div>
              <input
                type="number"
                id="minimum-stock-input"
                className="form-control"
                placeholder="xx"
                aria-label="Minimum Stock"
                aria-describedby="basic-addon1"
                value={data.minStock}
                onChange={(e) => {
                  formHandler({ ...data, minStock: Number(e.target.value) });
                }}
              ></input>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
