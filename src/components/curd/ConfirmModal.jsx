import { useEffect } from "react";

function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    if (!open) return;

    function onKeyDown(e) {
      if (e.key === "Escape") onCancel();
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onCancel]);

  if (!open) return null;

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onCancel();
  }

  return (
    <div
      className="contact-confirm-overlay"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        className="contact-confirm-box"
        role="dialog"
        aria-modal="true"
        aria-labelledby="contact-confirm-title"
      >
        <div className="contact-confirm-box__icon" aria-hidden="true">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 id="contact-confirm-title" className="contact-confirm-box__title">
          {title}
        </h3>
        <p className="contact-confirm-box__message">{message}</p>
        <div className="contact-confirm-box__actions">
          <button
            type="button"
            className="contact-confirm-box__btn contact-confirm-box__btn--cancel"
            onClick={onCancel}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className="contact-confirm-box__btn contact-confirm-box__btn--danger"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
