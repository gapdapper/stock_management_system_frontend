import { useEffect, useState } from "react";
import "../components/headers.scss";

type Prop = {
  currentMonth: string;
  availableMonths: string[];
  onRefresh: (month: string) => void;
};

export default function Headers({
  currentMonth,
  availableMonths,
  onRefresh,
}: Prop) {
  const [formattedMonth, setFormattedMonth] = useState<
    { val: string; display: string }[]
  >([]);

  useEffect(() => {
    if (!availableMonths.length) {
      const today = new Date();
      const val = `${today.getFullYear()}-${today.getMonth()}`;
      const display = `${today.toLocaleString("default", { month: "long" })} - ${today.getFullYear()}`;
      setFormattedMonth([{ val: val, display: display }]);
    } else {
      let formatted = availableMonths.map((monthStr) => {
        const [year, month] = monthStr.split("-").map((val) => Number(val));
        const newDate = new Date(year, month);

        return {
          val: monthStr,
          display: `${newDate.toLocaleString("default", { month: "long" })} - ${newDate.getFullYear()}`,
        };
      });
      setFormattedMonth(formatted);
    }
  }, [availableMonths]);

  return (
    <>
      <div className="dashboard-header mb-3 d-flex justify-content-between">
        <h1 className="dashboard-title">Dashboard - {currentMonth}</h1>
        <div className="dashboard-input align-self-center">
          <select
            name="date-range-filter"
            id="date-range-filter"
            onChange={(e) => onRefresh(e.target.value)}
            defaultValue="all"
          >
            {formattedMonth.length &&
              formattedMonth.map((month) => {
                return (
                  <option key={month.val} value={month.val}>
                    {month.display}
                  </option>
                );
              })}
          </select>
        </div>
      </div>
    </>
  );
}
