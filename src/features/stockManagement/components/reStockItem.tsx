import type {
  IProductData,
  IProductSize,
  IWaitingProduct,
} from "@/app/types/product";
import { useEffect, useState } from "react";
import "./reStockItem.scss";

type RestockItemProps = {
  data?: IProductData[];
  onCloseConditon: (val: IWaitingProduct[]) => void;
};

export default function ReStockItem({
  data,
  onCloseConditon,
}: RestockItemProps) {
  const [productData, setproductData] = useState<IProductData[]>([]);
  const [waitingList, setwaitingList] = useState<IWaitingProduct[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<IProductData | null>(
    null
  );
  const [selectedSize, setSelectedSize] = useState<IProductSize | null>(null);
  const [selectedColor, setselectedColor] = useState<string>("");
  const [selectedQty, setselectedQty] = useState<number>(0);
  const handleProductChange = (productId: number) => {
    const product = data?.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
    setSelectedSize(null);
    setselectedColor("");
    setselectedQty(0);
  };

  const handleProductAdd = () => {
    const product = data?.find((p) => p.id === selectedProduct?.id);
    const size = product?.variants.find((v) => v.size === selectedSize?.size);
    const color = size?.sub.find((s) => s.color === selectedColor);
    const waitingProduct = {
      variantId: color?.variantId!,
      productName: product?.productName!,
      size: size?.size!,
      color: color?.color!,
      stock: selectedQty,
    };

    setwaitingList((prev) => [...prev, waitingProduct]);
    setSelectedProduct(null);
    setSelectedSize(null);
    setselectedColor("");
    setselectedQty(0);
  };

  useEffect(() => {
    if (!data) {
      throw new Error("No product data provided");
    }
    const sortedData = data.sort((a, b) =>
      a.productName.localeCompare(b.productName)
    );
    setproductData(sortedData);
  }, [data]);

  useEffect(() => {
    onCloseConditon(waitingList);
  }, [waitingList]);

  const handleRemoveListItem = (variantId: number) => {
    const updatedWaitingList = waitingList.filter(
      (item) => item.variantId != variantId
    );
    setwaitingList(updatedWaitingList);
  };

  return (
    <div className="restock-container">
      <div className="waiting-list">
        <p>Products</p>
        {waitingList.length === 0 && <p className="empty">No items added</p>}
        {waitingList.map((p, index) => (
          <div className="waiting-item" key={index}>
            <div className="item-info">
              <span className="name">{p.productName}</span>
              <span className="meta">
                Size: <b>{p.size}</b> • Color: <b>{p.color}</b> • Qty:{" "}
                <b>{p.stock}</b>
              </span>
            </div>

            <button
              className="btn-remove"
              onClick={() => handleRemoveListItem(p.variantId)}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <div className="restock-form">
        {/* PRODUCT */}
        <div className="form-row">
          <select
            name="product-name"
            id="product-name"
            value={selectedProduct?.id ?? ""}
            onChange={(e) => handleProductChange(Number(e.target.value))}
          >
            <option value="" disabled>
              Select a product
            </option>

            {productData?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.productName}
              </option>
            ))}
          </select>
          {/* SIZE */}
          {selectedProduct && (
            <select
              name="product-size"
              id="product-size"
              value={selectedSize?.size ?? ""}
              onChange={(e) => {
                const size =
                  selectedProduct?.variants.find(
                    (v) => v.size === e.target.value
                  ) || null;

                setSelectedSize(size);
                setselectedColor("");
              }}
            >
              <option value="" disabled>
                Select a size
              </option>

              {selectedProduct.variants.map((v) => (
                <option key={v.size} value={v.size}>
                  {v.size}
                </option>
              ))}
            </select>
          )}

          {/* COLOR */}
          {selectedSize && (
            <select
              name="product-color"
              id="product-color"
              value={selectedColor}
              onChange={(e) => setselectedColor(e.target.value)}
            >
              <option value="" disabled>
                Select a color
              </option>

              {selectedSize.sub.map((s) => (
                <option key={s.color} value={s.color}>
                  {s.color}
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="form-row">
          {/* QTY */}
          {selectedSize && selectedColor && (
            <input
              type="number"
              value={selectedQty}
              maxLength={4}
              onChange={(e) => setselectedQty(Number(e.target.value))}
            />
          )}

          {/* add item to waiting list */}
          {selectedSize && selectedColor && (
            <button
              className="btn-add"
              onClick={handleProductAdd}
              disabled={selectedQty == 0}
            >
              +
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
