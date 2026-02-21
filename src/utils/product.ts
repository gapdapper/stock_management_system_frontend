import type { IProductData } from "@/app/types/product";

export const getProductStatus = (variants: IProductData["variants"]) => {
  return variants.some(v =>
    v.sub.some(s => s.stock < s.minStock)
  )
    ? "Low stock"
    : "In-stock";
};

export const validateFileSize = (file: File) => {
  const maxFileSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxFileSizeInBytes) {
    return null;
  }
  return file
} 