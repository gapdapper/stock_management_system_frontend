import "./productDetail.scss";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
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
      <div className="product-detail row">
        <div className="col-5">
          <div className="product-image col-12">
            <PlaceHolder />
          </div>

          <div className="status-badge col-12">
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
        <div className="col-7">
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
            <label htmlFor="minimum-stock-input">
              <strong>Minimum Stock</strong>
            </label>
            <div className="custom-tooltip">
              <FontAwesomeIcon icon={faCircleQuestion} />
              <span className="custom-tooltiptext">
                Triggers Low stock when stock falls below this value.
              </span>
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
    </>
  );
}
