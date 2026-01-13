import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft } from "@fortawesome/free-solid-svg-icons";
import "./SummaryCard.scss";
import { useNavigate } from "react-router";

export default function SummaryCard() {
  let navigate = useNavigate();

  const data = {
    id: 1,
    orderId: "ORD-001",
    buyer: "John",
    platformId: "Shopee",
    paymentTypeId: "Credit Card",
    status: "shipped",
    createdAt: new Date(),
    note: "-",
  };

  return (
    <section className="summary-card">
      {/* Header */}
      <div className="summary-header">
        <h2>
          <FontAwesomeIcon
            className="prev-btn"
            icon={faCircleLeft}
            onClick={() => navigate(`/sales`)}
          />{" "}
          {data.orderId}
        </h2>
        <span className={`status-badge ${data.status}`}>{data.status}</span>
      </div>

      {/* Meta info */}
      <div className="summary-grid">
        <div className="summary-item">
          <span className="label">Buyer</span>
          <span className="value">{data.buyer}</span>
        </div>

        <div className="summary-item">
          <span className="label">Platform</span>
          <span className="value">{data.platformId}</span>
        </div>

        <div className="summary-item">
          <span className="label">Payment</span>
          <span className="value">{data.paymentTypeId}</span>
        </div>

        <div className="summary-item">
          <span className="label">Created At</span>
          <span className="value">{data.createdAt.toLocaleString()}</span>
        </div>
      </div>

      {/* Note */}
      <div className="summary-note">
        <span className="label">Note</span>
        <p className="value">{data.note || "-"}</p>
      </div>
    </section>
  );
}
