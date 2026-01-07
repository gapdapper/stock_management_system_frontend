import "./productDetail.scss";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion } from "@fortawesome/free-solid-svg-icons";

type ProductDetailProp = {
  name: string;
  size: string;
  color: string;
  stock: number;
  minStock: number;
};

export default function ProductDetail({
  name,
  size,
  color,
  stock,
  minStock,
}: ProductDetailProp) {
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
                stock >= minStock
                  ? "badge rounded-pill text-bg-success"
                  : "badge rounded-pill text-bg-danger"
              }
            >
              {stock >= minStock ? "In-stock" : "Low stock"}
            </span>
          </div>
        </div>
        <div className="col-7">
          <p>
            <strong>Product:</strong> {name}
          </p>
          <p>
            <strong>Size:</strong> {size}
          </p>
          <p>
            <strong>Color:</strong> {color}
          </p>
          <div className="input-form">
            <label htmlFor="stock-input">
              <strong>Stock</strong>
            </label>
            <input
              type="text"
              id="stock-input"
              className="form-control"
              placeholder="xx"
              aria-label="Stock"
              aria-describedby="basic-addon1"
              value={stock}
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
              type="text"
              id="minimum-stock-input"
              className="form-control"
              placeholder="xx"
              aria-label="Minimum Stock"
              aria-describedby="basic-addon1"
              value={minStock}
            ></input>
          </div>
        </div>
      </div>
    </>
  );
}
