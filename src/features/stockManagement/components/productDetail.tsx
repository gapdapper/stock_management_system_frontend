import "./productDetail.scss";
import PlaceHolder from "../../../assets/placeholder.svg?react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleQuestion, faWrench } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useMemo, useRef } from "react";
import Toast, { showToast } from "@/components/toast";
import { uploadProductImage } from "@/features/stockManagement/api/uploadImage";
import { validateFileSize } from "@/utils/product";

type ProductDetailProp = {
  data: any;
  formHandler: (data: any) => void;
  onDirtyChange: (data: any) => void;
  onRefresh: () => Promise<void>;
};

export default function ProductDetail({
  data,
  formHandler,
  onDirtyChange,
  onRefresh,
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

  const submitVariantImage = async (file: File) => {
    const validatedFile = validateFileSize(file);
    try {
      if (!validatedFile) {
      showToast('The selected image exceeds the file size limit. (5 MB)', 'error');
      return;
      }
      await uploadProductImage("variant", data.variantId, validatedFile)
      showToast('Product Variant Image Updated Successfully.', 'success');
      await onRefresh();
    } catch (error) {
      console.error("Failed to update the product data.");
      showToast('Failed to update the product data.', 'error');
    }
  }

  useEffect(() => {
    onDirtyChange(isDirty);
  }, [isDirty, onDirtyChange]);

  useEffect(() => {
    console.log(data)
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
                {data.variantImageUrl != "" ? (
                  <img
                    src={data.variantImageUrl}
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
                      submitVariantImage(file);
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
                maxLength={4}
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
                maxLength={4}
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
      <Toast />
    </>
  );
}
