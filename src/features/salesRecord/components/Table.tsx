import { useNavigate } from "react-router";
import "./Table.scss";
import type { IFilter, ITransactions } from "@/app/types/transaction";
import { useEffect, useState } from "react";

type Prop = {
  data: ITransactions[];
  filter: IFilter;
};

export default function Table({ data, filter }: Prop) {
  let navigate = useNavigate();
  const [tableData, setTableData] = useState<ITransactions[]>([]);

  useEffect(() => {
    let result = [...data];
    console.log(data);
    console.log(filter);

    // Status filter
    if (filter.status !== "all") {
      result = result.filter((item) => item.status === filter.status);
    }

    // Platform filter
    if (filter.platform !== "all") {
      result = result.filter((item) => item.platform === filter.platform);
    }

    // Date range filter
    if (filter.period !== "all") {
      const now = new Date();

      result = result.filter((item) => {
        const createdAt = new Date(item.createdAt);

        switch (filter.period) {
          case "today":
            return createdAt.toDateString() === now.toDateString();

          case "last-7-days":
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(now.getDate() - 7);
            return createdAt >= sevenDaysAgo;

          case "this-month":
            return (
              createdAt.getMonth() === now.getMonth() &&
              createdAt.getFullYear() === now.getFullYear()
            );

          default:
            return true;
        }
      });
    }
    setTableData(result);
  }, [data, filter]);

  return (
    <div className="table-wrapper">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Buyer</th>
            <th>Platform</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((item) => (
            <tr
              key={item.id}
              className="data-row"
              onClick={() =>
                navigate(`/sales/${item.orderId.replace(" ", "")}`)
              }
            >
              <td className="order-id">{item.orderId}</td>
              <td>{item.buyer}</td>
              <td>{item.platform}</td>
              <td>{item.paymentType}</td>
              <td>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </td>
              <td>{new Date(item.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
