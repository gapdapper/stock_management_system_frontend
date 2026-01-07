import type { IProductData } from "@/app/types/product";

export const getProductStatus = (variants: IProductData["variants"]) => {
  return variants.some(v =>
    v.sub.some(s => s.stock < s.minStock)
  )
    ? "Low stock"
    : "In-stock";
};
