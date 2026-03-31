import type { IProductData } from "@/types/product";

export const getProductStatus = (variants: IProductData["variants"]) => {
  const allSubVariants = variants.flatMap(v => v.sub);

  const filtered = allSubVariants.filter(
    s => !(s.stock === 0 && s.minStock === 0)
  );

  if (filtered.some(s => s.stock <= 0)) {
    return "Out of stock";
  }

  if (filtered.some(s => s.minStock > 0 && s.stock < s.minStock)) {
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

export const validateFileFormat = (file: File) => {
  const allowedTypes = ["image/png", "image/jpeg"];
  return allowedTypes.includes(file.type);
};

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