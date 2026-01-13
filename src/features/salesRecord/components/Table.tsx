import { useNavigate } from "react-router";
import "./Table.scss";

export default function Table() {
  let navigate = useNavigate();

  const data = [
    {
      id: 1,
      orderId: "ORD-001",
      buyer: "John",
      platformId: "Shopee",
      paymentTypeId: "Credit Card",
      status: "shipped",
      createdAt: new Date(),
    },
    {
      id: 2,
      orderId: "ORD-002",
      buyer: "Jack",
      platformId: "Lazada",
      paymentTypeId: "PromptPay",
      status: "completed",
      createdAt: new Date(),
    },
  ];

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
          {data.map((item) => (
            <tr
              key={item.id}
              className="data-row"
              onClick={() => navigate(`/sales/${item.id}`)}
            >
              <td className="order-id">{item.orderId}</td>
              <td>{item.buyer}</td>
              <td>{item.platformId}</td>
              <td>{item.paymentTypeId}</td>
              <td>
                <span className={`status-badge ${item.status}`}>
                  {item.status}
                </span>
              </td>
              <td>{item.createdAt.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
