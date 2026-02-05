"use client";

import "@/styles/modal.css";

export function ConfirmModal({
  open,
  title,
  description,
  confirmText = "Sim",
  cancelText = "Não",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;

  return (
    <div className="modalOverlay" role="dialog" aria-modal="true">
      <div className="modalCard">
        <div className="modalTitle">{title}</div>
        <div className="modalDesc">{description}</div>

        <div className="modalActions">
          <button className="btn btnOutline" type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button className="btn btnPrimary" type="button" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
