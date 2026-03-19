import { createPortal } from "react-dom";
import "./SuccessModal.scss";

type SuccessModalProps = {
  title: string;
  children: React.ReactNode;
  primaryAction: () => void;
  primaryActionName: string;
  secondaryAction?: () => void;
  secondaryActionName?: string;
};

export default function SuccessModal({
  title,
  children,
  primaryAction,
  primaryActionName,
  secondaryAction,
  secondaryActionName,
}: SuccessModalProps) {
  return createPortal(
    <div className="success-modal-container">
      <div className="success-modal-content">
        <svg viewBox="-10 -10 150 150" className="success-icon">
          <circle className="circle-bg" cx="65.1" cy="65.1" r="62.1" />
          <polyline
            className="check"
            fill="none"
            stroke="#fff"
            strokeWidth="6"
            strokeLinecap="round"
            points="100.2,40.2 51.5,88.8 29.8,67.5"
          />
        </svg>
        <h4>{title}</h4>
        {children}
      <div className="success-modal-actions">
        <button className="btn btn-primary" onClick={() => primaryAction()}>{primaryActionName}</button>
        {secondaryAction && (<button className="btn btn-secondary" onClick={() => secondaryAction()}>{secondaryActionName}</button>)}
      </div>
      </div>
    </div>,
    document.body,
  );
}
