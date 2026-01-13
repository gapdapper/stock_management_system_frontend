import Itemtable from "./ItemTable";
import SummaryCard from "./SummaryCard";

export default function SalesDetail() {
  const items = [
    { name: "product-1", size: "L", color: "Black", qty: 3 },
    { name: "product-2", size: "S", color: "Green", qty: 1 },
  ];

  return (
    <>
      <SummaryCard />
      <Itemtable data={items}/>
    </>
  );
}
