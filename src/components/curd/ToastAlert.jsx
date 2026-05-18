import { useEffect } from "react";

function ToastAlert({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);

    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const alertType =
    toast.type === "danger"
      ? "alert-danger"
      : toast.type === "warning"
        ? "alert-warning"
        : "alert-success";

  return (
    <div className="toast-alert-wrapper" aria-live="polite">
      <div
        className={`toast-alert-inner alert ${alertType} alert-dismissible shadow mb-0`}
        role="alert"
      >
        <strong className="me-1">
          {toast.type === "danger" ? "Error!" : "Success!"}
        </strong>
        {toast.message}
        <button
          type="button"
          className="btn-close"
          aria-label="Close"
          onClick={onDismiss}
        />
      </div>
    </div>
  );
}

export default ToastAlert;
