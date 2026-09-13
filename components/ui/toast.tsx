"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";

type ToastVariant = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

let toastId = 0;

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, variant }]);
      const timer = setTimeout(() => dismiss(id), 3000);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const variantStyles: Record<ToastVariant, string> = {
    success: "border-success/30 bg-canvas-elevated text-success",
    error: "border-danger/30 bg-canvas-elevated text-danger",
    info: "border-secondary/30 bg-canvas-elevated text-secondary",
  };

  return (
    <div
      className={[
        "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium backdrop-blur-sm",
        "animate-in slide-in-from-right-5 fade-in duration-300",
        variantStyles[toast.variant],
      ].join(" ")}
      role="alert"
    >
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
}

function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return ctx;
}

export { useToast, ToastItem };
