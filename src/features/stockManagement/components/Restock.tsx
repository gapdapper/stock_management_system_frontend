import "./Restock.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleMinus, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import type {
  IProductData,
  IRestockSumamry,
  IWaitingProduct,
} from "@/types/product";
import { useEffect, useMemo, useState } from "react";
import {
  getProductsWithVariant,
  restockProduct,
} from "../api/StockManagementService";
import { getProductStatus } from "@/utils/product";
import SuccessModal from "@/components/SuccessModal";
import { useNavigate } from "react-router";

export default function Restock() {
  const [waitingList, setWaitingList] = useState<IWaitingProduct[]>([]);
  const [productData, setProductData] = useState<IProductData[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorMsg, setShowErrorMsg] = useState(false);
  const [summary, setSummary] = useState<IRestockSumamry[]>([]);

  let navigate = useNavigate();

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
      const summaryData = buildSummary();
      await restockProduct(payload);
      setSummary(summaryData);
      setWaitingList([]);
      setShowSuccess(true);
      console.log(summaryData);
    } catch (error) {
      throw new Error("Failed to restock the product: " + error);
    }
  };

  const handleSubmit = async () => {
      const isFormValid =
    waitingList.length > 0 &&
    waitingList.every(
      (item) => item.productId && item.size && item.color && item.stock > 0,
    );

    if(!isFormValid){
      setShowErrorMsg(true);
      return;
    }
    setShowErrorMsg(false);
    await restockItem();
  }

  const isItemComplete = (item: IWaitingProduct) => {
    return item.productId && item.size && item.color && item.stock > 0;
  };

  const clearWaitingList = () => {
    setWaitingList([]);
    setShowErrorMsg(false);
  };

  const handleRestockAgain = () => {
    setShowSuccess(false);
  };

  const buildSummary = (): IRestockSumamry[] => {
    return waitingList.map((item) => {
      const product = productMap.get(item.productId!);
      const size = product?.variants.find((v) => v.size === item.size);
      const variant = size?.sub.find((s) => s.color === item.color);

      const beforeQty = variant?.stock ?? 0;
      const afterQty = beforeQty + item.stock;

      return {
        productName: item.productName,
        size: item.size,
        color: item.color,
        beforeQty,
        afterQty,
      };
    });
  };

  const productMap = useMemo(
    () => new Map(productData.map((p) => [p.id, p])),
    [productData],
  );

  return (
    <div>
      <h3 className="restock-header"><span className="breadcrumb-link" onClick={() => navigate("/")}>Stock Management</span> <FontAwesomeIcon icon={faAngleRight} className="breadcrumb-seperator"/> Restock</h3>
      <div className="restock-container">
        <div className="product-list-header">
        <h5>Product List</h5>
        <p className="product-list-description">
          Add products, choose size and color, then enter quantity.
        </p>
        </div>
        {waitingList.length != 0 &&
          waitingList.map((item, index) => {
            const product = item.productId
              ? productMap.get(item.productId)
              : undefined;
            const size = product?.variants.find((v) => v.size === item.size);
            return (
              <div className={`product-card ${showErrorMsg && !isItemComplete(item) ? "error" : ""}`} key={item.variantId || index}>
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
                    id="product-qty-input"
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
                  <FontAwesomeIcon icon={faCircleMinus} />
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
          <div className="summary-info">
            {waitingList.length != 0 && (<p><span className="total-product">Total Product:</span> {waitingList.length}</p>)}
          </div>
          <div className="summary-btn">
            <button
              className="btn btn-secondary"
              onClick={() => clearWaitingList()}
            >
              Clear
            </button>
            <button
              className="btn btn-success"
              disabled={waitingList.length === 0}
              onClick={() => handleSubmit()}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
      {showSuccess && (
        <SuccessModal
          title="Restock Successfully!"
          primaryAction={() => {
            navigate("/");
          }}
          primaryActionName="Back to Stock"
          secondaryAction={() => {
            handleRestockAgain();
          }}
          secondaryActionName="Restock Again"
        >
          <div className="product-summary fade-in">
            <p className="summary-title">Product Summary</p>
            <div className="product-summary-content">
              {summary.map((item, i) => (
                <div className="product-summary-item" key={i}>
                  <div className="product-info">
                    <span className="product-name">{item.productName} x{item.afterQty - item.beforeQty}</span>
                    <span className="variant">
                      {item.size} / {item.color}
                    </span>
                  </div>

                  <div className="qty-change">
                    <span className="before">{item.beforeQty}</span>
                    <span className="arrow">→</span>
                    <span className="after">{item.afterQty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </SuccessModal>
      )}
    </div>
  );
}
