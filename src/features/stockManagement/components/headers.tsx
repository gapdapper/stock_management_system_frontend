import "./headers.scss"

type HeadersProps = {
  filterVal?: string;
  setFilterVal: (val: string) => void;
};

export default function Headers({ filterVal, setFilterVal }: HeadersProps) {
  return (
    <div className="stock-header">
      <h1 className="stock-title">Stock Management</h1>

      <div className="search-box">
        <input
          id="name-filter-input"
          name="name-filter-input"
          type="text"
          value={filterVal}
          placeholder="Search by product name"
          onChange={(e) => setFilterVal(e.target.value)}
        />
      </div>
    </div>
  );
}
