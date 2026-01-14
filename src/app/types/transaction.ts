export interface ITransactions {
  id: number;
  orderId: string;
  buyer: string;
  status: string;
  createdAt: Date;
  paymentType: string;
  platform: string;
  note: string;
  items?: ITransactionItem[]
}

export interface ITransactionItem {
  variantId: number;
  productName: string;
  size: string;
  color: string;
  quantity: number;
}