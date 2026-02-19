type Prop = {
  currentMonth: string;
}

export default function Headers({ currentMonth }: Prop) {
  return (
    <>
      <div className="dashboard-header mb-3">
        <h1 className="dashboard-title">Dashboard - {currentMonth}</h1>
      </div>
    </>
  );
}
