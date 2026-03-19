export interface IDashboardOverview {
  totalOrders: number;
  unitsSold: number;
  avgItemsPerOrder: number;
  topItems: ITopItems[];
  salesByPlatform: ISalesByPlatform[];
  salesByStatus: ISalesByStatus[];
}

export interface ITopItems {
  productId: number;
  productName: string;
  totalSold: number;
}

export interface ISalesByPlatform {
  platform: string;
  total: number;
}

export interface ISalesByStatus {
  status: string;
  count: number;
}

export interface IChartData {
  name: string;
  value: number;
  zz?: string;
  [key: string]: any;
}

export interface IDateRange {
  start: Date;
  end: Date;
}

export interface IMonthOption {
  val: string; 
  display: string
}