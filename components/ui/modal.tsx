"use client";

import { useEffect, type HTMLAttributes } from "react";

interface ModalProps extends HTMLAttributes<HTMLDivElement> {
  open: boolean;
  onClose?: () => void;
  title?: string;
}

function Modal({
  open,
  onClose,
  title,
  className = "",
  children,
  ...props
}: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={[
          "relative z-10 w-full max-w-md rounded-2xl bg-surface border border-border p-6",
          "shadow-xl shadow-black/40",
          className,
        ].join(" ")}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        {...props}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between mb-5">
            {title && (
              <h2 className="text-lg font-semibold text-text-primary font-sora">
                {title}
              </h2>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="ml-auto p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-white/5 transition-colors cursor-pointer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

export { Modal, type ModalProps };
