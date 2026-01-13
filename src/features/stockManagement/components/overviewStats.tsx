import type { IDateRange } from "@/app/types/dashboard";
import "./overviewStats.scss";

type Prop = {
  totalOrder?: number;
  unitSold?: number;
  avgItems?: number;
  dateRange?: IDateRange;
};

export default function OverviewStats({
  totalOrder,
  unitSold,
  avgItems,
  dateRange
}: Prop) {

  return (
    <>
      <div className="overview-stat">
        <div className="total-order">{totalOrder}</div>
        <div className="unit-sold">{unitSold}</div>
        <div className="avg-items">{avgItems}</div>
      </div>
      <div className="dashboard-period">
        <div className="period-label">Month to Date</div>
        <div className="period-range">
          {dateRange?.start.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}{" "}
          –{" "}
          {dateRange?.end.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </div>
      </div>
    </>
  );
}
