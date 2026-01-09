export interface IProductData {
  id: number;
  productName: string;
  totalStock: number;
  lastUpdated: Date;
  variants: {
    size: string;
    sub: {
      variantId: number;
      color: string;
      stock: number;
      minStock: number;
    }[];
  }[];
}

export interface IProductVariantPayload {
  id: number;
  qty: number;
  minStock: number;
}