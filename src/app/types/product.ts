export interface IProductData {
  id: number;
  productName: string;
  totalStock: number;
  lastUpdated: Date;
  status?: string;
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

export interface IWaitingProduct {
  variantId: number;
  productName: string;
  size: string;
  color: string;
  stock: number;
}

export interface IBulkRestockPayload {
  items: {
    variantId: number;
    qty: number;
  }[];
}

export interface IProductSize {
  size: string;
  sub: {
    variantId: number;
    color: string;
    stock: number;
    minStock: number;
  }[];
}
