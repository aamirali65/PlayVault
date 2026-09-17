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
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={[
          "relative z-10 w-full max-w-md rounded-[20px] bg-canvas-card border border-border p-6",
          "shadow-[0_25px_60px_rgba(0,0,0,0.6)]",
          "animate-scale-in",
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
              <h2 className="text-lg font-extrabold text-text-primary font-display">
                {title}
              </h2>
            )}
            {onClose && (
              <button
                onClick={onClose}
                className="ml-auto w-8 h-8 flex items-center justify-center rounded-[8px] text-text-muted hover:text-gold hover:bg-gold/10 transition-all cursor-pointer"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
