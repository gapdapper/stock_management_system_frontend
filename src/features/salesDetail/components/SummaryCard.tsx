import "./SummaryCard.scss";
import type { ITransactions } from "@/types/transaction";

type Prop = {
  data: ITransactions;
};

export default function SummaryCard({ data }: Prop) {

  return (
    <section className="summary-card">
      {/* Header */}
      <div className="summary-header">
        <h2>
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
          <span className="value">{data.platform}</span>
        </div>

        <div className="summary-item">
          <span className="label">Payment</span>
          <span className="value">{data.paymentType}</span>
        </div>

        <div className="summary-item">
          <span className="label">Created At</span>
          <span className="value">{new Date(data.createdAt).toLocaleString()}</span>
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
