"use client";

import { useEffect } from "react";

export interface Toast {
  id: number;
  message: string;
  action?: { label: string; onClick: () => void };
}

export function Snackbar({ toast, onClose }: { toast: Toast | null; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = window.setTimeout(onClose, toast.action ? 6000 : 3500);
    return () => window.clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;
  return (
    <div className="snackbar" role="status" aria-live="polite" key={toast.id}>
      <span className="snackbar-message">{toast.message}</span>
      {toast.action && (
        <button
          type="button"
          className="snackbar-action"
          onClick={() => {
            toast.action?.onClick();
            onClose();
          }}
        >
          {toast.action.label}
        </button>
      )}
    </div>
  );
}
