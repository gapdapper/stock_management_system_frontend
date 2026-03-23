import type { IProductData } from "@/types/product";

export const getProductStatus = (variants: IProductData["variants"]) => {
  const allSubVariants = variants.flatMap(v => v.sub);

  if (allSubVariants.some(s => s.stock <= 0)) {
    return "Out of stock";
  }

  if (allSubVariants.some(s => s.stock < s.minStock)) {
    return "Low stock";
  }

  return "In-stock";
};

export const validateFileSize = (file: File) => {
  const maxFileSizeInBytes = 5 * 1024 * 1024; // 5MB
  if (file.size > maxFileSizeInBytes) {
    return null;
  }
  return file
} 

export const platformMapper = (id: number) => {
  switch (id) {
    case 1:
      return "Shopee";
    case 2:
      return "Lazada";
    case 3:
      return "TikTok Shop";
    default:
      return "N/A";
  }
}