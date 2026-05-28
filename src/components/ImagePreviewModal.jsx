import { useEffect, useRef } from "react";

function ImagePreviewModal({ open, imageUrl, title, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && imageUrl) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, imageUrl]);

  useEffect(() => {
    if (!open) return;

    function handleEsc(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open || !imageUrl) {
    return null;
  }

  return (
    <dialog
      ref={dialogRef}
      className="image-preview-modal"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <button
        type="button"
        className="image-preview-modal__backdrop"
        onClick={onClose}
        aria-label="Close preview"
        tabIndex={-1}
      />

      <div
        className="image-preview-modal__content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="image-preview-modal__toolbar">
          <p className="image-preview-modal__title">{title}</p>
          <button
            type="button"
            className="image-preview-modal__close"
            onClick={onClose}
            aria-label="Close preview modal"
          >
            ×
          </button>
        </div>
        <div className="image-preview-modal__image-wrap">
          <img src={imageUrl} alt={title} />
        </div>
      </div>
    </dialog>
  );
}

export default ImagePreviewModal;
