import { useEffect } from "react";

type ModalProps = {
  title: string;
  id: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  confirmDisabled: boolean;
  size?: string;
  onClose?: () => void;
};

export default function Modal({
  title,
  id,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  confirmDisabled,
  size = "",
  onClose
}: ModalProps) {

  useEffect(() => {
  const el = document.getElementById(`modal-${id}`);
  if (!el) return;

  const handler = () => onClose?.();

  el.addEventListener("hidden.bs.modal", handler);
  return () => el.removeEventListener("hidden.bs.modal", handler);
}, [id, onClose]);

  return (
<div className={`modal ${size} fade`} id={`modal-${id}`} tabIndex={-1} aria-labelledby={`${id}ModalLabel`} aria-hidden="true" aria-modal="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id={`${id}ModalLabel`}>{title}</h1>
        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        {children}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">{cancelText}</button>
        <button type="button" className="btn btn-primary" data-bs-dismiss="modal" onClick={onConfirm} disabled={confirmDisabled}>{confirmText}</button>
      </div>
    </div>
  </div>
</div>
  );
}
