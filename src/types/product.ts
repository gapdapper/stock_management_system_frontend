export interface IProductData {
  id: number;
  productName: string;
  totalStock: number;
  lastUpdated: Date;
  status?: string;
  productImageUrl: string;
  variants: {
    size: string;
    sub: {
      variantId: number;
      color: string;
      stock: number;
      minStock: number;
      variantImageUrl: string;
    }[];
  }[];
}

export interface IProductVariantPayload {
  id: number;
  qty: number;
  minStock: number;
}

export interface IWaitingProduct {
  productId?: number;
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

export interface IProductEditModalData {
  productId: number;
  variantId: number;
  productName: string;
  size: string;
  color: string;
  qty: number;
  minStock: number;
  variantImageUrl: string;
}

export interface IRestockSummary {
  productName: string;
  size: string;
  color: string;
  beforeQty: number;
  afterQty: number;
}
