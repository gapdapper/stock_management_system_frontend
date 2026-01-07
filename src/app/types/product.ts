export interface IProductData {
  id: number;
  productName: string;
  totalStock: number;
  lastUpdated: Date;
  variants: {
    size: string;
    sub: {
      color: string;
      stock: number;
      minStock: number;
    }[];
  }[];
}
