import "./Restock.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import type { IProductData, IWaitingProduct } from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import {
  getProductsWithVariant,
  restockProduct,
} from "../api/StockManagementService";
import { getProductStatus } from "@/utils/product";
import { useNavigate } from "react-router";

export default function Restock() {
  const [waitingList, setWaitingList] = useState<IWaitingProduct[]>([]);
  const [productData, setProductData] = useState<IProductData[]>([]);

  let navigate = useNavigate();

  const isFormValid =
    waitingList.length > 0 &&
    waitingList.every(
      (item) => item.productId && item.size && item.color && item.stock > 0,
    );

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const data = await getProductsWithVariant();
        const mappedData = data.products
          .map((product) => {
            return { ...product, status: getProductStatus(product.variants) };
          })
          .sort((a, b) => a.productName.localeCompare(b.productName));
        setProductData(mappedData);
      } catch (error) {
        console.error("Failed to fetch product data");
      }
    };

    fetchProductData();
  }, []);

  const addProductTemplate = () => {
    setWaitingList((prev) => [
      ...prev,
      {
        variantId: 0,
        productName: "",
        size: "",
        color: "",
        stock: 0,
      },
    ]);
  };

  const handleRemoveProduct = (index: number) => {
    setWaitingList((prev) => prev.filter((_, i) => i != index));
  };

  const handleProductSelect = (productId: number, index: number) => {
    const product = productData?.find((p) => p.id === productId) || null;

    setWaitingList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        productId,
        productName: product?.productName || "",
        size: "",
        color: "",
        variantId: 0,
        stock: 0,
      };
      return updated;
    });
  };

  const handleSizeChange = (size: string, index: number) => {
    setWaitingList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        size,
        color: "",
      };
      return updated;
    });
  };

  const handleColorChange = (color: string, index: number) => {
    setWaitingList((prev) => {
      const updated = [...prev];
      const item = updated[index];

      const product = productData.find((p) => p.id === item.productId);
      const size = product?.variants.find((v) => v.size === item.size);
      const variant = size?.sub.find((s) => s.color === color);

      updated[index] = {
        ...item,
        color,
        variantId: variant?.variantId || 0,
      };

      return updated;
    });
  };

  const handleQtyChange = (qty: number, index: number) => {
    setWaitingList((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        stock: qty,
      };
      return updated;
    });
  };

  const restockItem = async () => {
    const payload = {
      items: waitingList.map((item) => ({
        variantId: item.variantId,
        qty: item.stock,
      })),
    };
    try {
      await restockProduct(payload);
      setWaitingList([]);

    } catch (error) {
      throw new Error("Failed to restock the product: " + error);
    }
  };

  const clearWaitingList = () => {
    setWaitingList([]);
  };

  const productMap = useMemo(
  () => new Map(productData.map((p) => [p.id, p])),
  [productData]
  );

  return (
    <div>
      <h3>Stock Management</h3>
      <div className="restock-container">
        <h5>Restock</h5>
        {waitingList.length != 0 &&
          waitingList.map((item, index) => {
            const product = item.productId ? productMap.get(item.productId) : undefined;
            const size = product?.variants.find((v) => v.size === item.size);
            return (
              <div className="product-card" key={item.variantId || index}>
                <p className="product-number">{index + 1}.</p>
                <div className="product-info">
                  <label htmlFor="product-name-dropdown">Product name</label>
                  <label htmlFor="product-size-dropdown">Product size</label>
                  <label htmlFor="product-color-dropdown">Product color</label>
                  <label htmlFor="product-qty-input">Quantity</label>
                  <select
                    name="product-name-dropdown"
                    id="product-name-dropdown"
                    className="product-name-dropdown"
                    value={item.productId ?? ""}
                    onChange={(e) =>
                      handleProductSelect(Number(e.target.value), index)
                    }
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
                  <select
                    name="product-size-dropdown"
                    id="product-size-dropdown"
                    className="product-size-dropdown"
                    value={item.size ?? ""}
                    disabled={!item.productName}
                    onChange={(e) => {
                      handleSizeChange(e.target.value, index);
                    }}
                  >
                    <option value="" disabled>
                      Select a size
                    </option>
                    {product?.variants.map((v) => (
                      <option key={v.size} value={v.size}>
                        {v.size}
                      </option>
                    ))}
                  </select>
                  <select
                    name="product-color-dropdown"
                    id="product-color-dropdown"
                    className="product-color-dropdown"
                    value={item.color ?? ""}
                    disabled={!item.size}
                    onChange={(e) => {
                      handleColorChange(e.target.value, index);
                    }}
                  >
                    <option value="" disabled>
                      Select a color
                    </option>
                    {size?.sub.map((s) => (
                      <option key={s.color} value={s.color}>
                        {s.color}
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="product-qty-input"
                    value={item.stock ?? 0}
                    disabled={!item.color}
                    onChange={(e) => {
                      handleQtyChange(Number(e.target.value), index);
                    }}
                  />
                </div>
                <button
                  className="remove-product-btn"
                  onClick={() => {
                    handleRemoveProduct(index);
                  }}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            );
          })}
        <div
          className="product-adding-card"
          onClick={() => {
            addProductTemplate();
          }}
        >
          <a className="add-product-btn">+ Add a product</a>
        </div>

        <div className="restock-summary">
          <p>Total product: {waitingList.length}</p>
          <div className="summary-btn">
            <button
              className="btn btn-secondary"
              onClick={() => clearWaitingList()}
            >
              Clear
            </button>
            <button
              className="btn btn-success"
              disabled={!isFormValid}
              onClick={() => restockItem()}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
