"use client";

import { useEffect } from "react";
import "@/styles/toast.css";

export type ToastType = "success" | "warning";

export function Toast({
  open,
  type,
  message,
  onClose,
}: {
  open: boolean;
  type: ToastType;
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className={`toast toast-${type}`} role="status">
      <div className="toastIcon">{type === "success" ? "✓" : "⚠"}</div>
      <div className="toastMsg">{message}</div>
      <button className="toastClose" type="button" onClick={onClose} aria-label="Fechar">
        ✕
      </button>
    </div>
  );
}
