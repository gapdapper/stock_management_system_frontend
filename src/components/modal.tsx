type ModalProps = {
  title: string;
  id: string;
  children: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
};

export default function Modal({
  title,
  id,
  children,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
}: ModalProps) {

  return (
<div className="modal fade" id={`modal-${id}`} tabIndex={-1} aria-labelledby={`${id}ModalLabel`} aria-hidden="true">
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
        <button type="button" className="btn btn-primary" onClick={onConfirm}>{confirmText}</button>
      </div>
    </div>
  </div>
</div>
  );
}
