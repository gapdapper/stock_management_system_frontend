import "../components/headers.scss";

type Prop = {
  currentMonth: string;
  availableMonths: string[];
  onRefresh: (month: string) => void;
};

export default function Headers({ currentMonth, availableMonths, onRefresh }: Prop) {

  return (
    <>
      <div className="dashboard-header mb-3 d-flex justify-content-between">
        <h1 className="dashboard-title">Dashboard - {currentMonth}</h1>
        <div className="dashboard-input align-self-center">
          <select
            name="date-range-filter"
            id="date-range-filter"
            onChange={(e) =>
              onRefresh(e.target.value)
            }
            defaultValue="all"
          >
            {availableMonths.length && availableMonths.map((month) => {
              return <option key={month} value={month}>{month}</option>
            })}
          </select>
        </div>
      </div>
    </>
  );
}
