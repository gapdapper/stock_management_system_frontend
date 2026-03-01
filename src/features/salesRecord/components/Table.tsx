import { useNavigate } from "react-router";
import "./Table.scss";
import type { ITransactions } from "@/app/types/transaction";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

type Prop = {
  data: ITransactions[];
};

export default function Table({ data }: Prop) {
  let navigate = useNavigate();
 
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
              {!data?.length && (
          <div className="empty-state">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            <p>No result found</p>
          </div>
        )}
    </div>
  );
}
