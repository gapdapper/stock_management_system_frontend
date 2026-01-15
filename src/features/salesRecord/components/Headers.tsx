import type { IFilter } from "@/app/types/transaction";
import type { Dispatch, SetStateAction } from "react";

type Prop = {
  filterSetter: Dispatch<SetStateAction<IFilter>>;
};

export default function Headers({ filterSetter }: Prop) {
  const handleFilterSelected = (key: keyof IFilter, val: string) => {
    filterSetter((prev: IFilter) => ({
      ...prev,
      [key]: val,
    }));
  };
  return (
    <div className="headers mb-3">
      <div className="d-flex justify-content-between align-items-start align-items-md-center gap-3 flex-column flex-md-row">
        <h1 className="stock-title">Sales</h1>
        <div className="filter-section d-flex gap-2 flex-wrap">
          <select
            name="status-filter"
            id="status-filter"
            onChange={(e) => handleFilterSelected("status", e.target.value)}
            defaultValue="all"
          >
            <option value="all">All Statuses</option>
            <option value="order placed">Order Placed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="returned">Returned</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="platform-filter"
            id="platform-filter"
            onChange={(e) => handleFilterSelected("platform", e.target.value)}
            defaultValue="all"
          >
            <option value="all">All Platforms</option>
            <option value="Shopee">Shopee</option>
            <option value="Lazada">Lazada</option>
            <option value="TikTok Shop">TikTok Shop</option>
          </select>

          <select
            name="date-range-filter"
            id="date-range-filter"
            onChange={(e) => handleFilterSelected("period", e.target.value)}
            defaultValue="all"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last-7-days">Last 7 Days</option>
            <option value="this-month">This Month</option>
          </select>
        </div>
      </div>
    </div>
  );
}
