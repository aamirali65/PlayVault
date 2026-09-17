"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";

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
      const timer = setTimeout(() => dismiss(id), 3500);
      timersRef.current.set(id, timer);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onDismiss={() => dismiss(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export default ToastProvider;

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
  const icons = {
    success: <CheckCircle className="h-5 w-5 text-emerald shrink-0" />,
    error: <XCircle className="h-5 w-5 text-rose shrink-0" />,
    info: <Info className="h-5 w-5 text-cyan shrink-0" />,
  };

  const borders = {
    success: "border-emerald/30",
    error: "border-rose/30",
    info: "border-cyan/30",
  };

  return (
    <div
      className={[
        "pointer-events-auto flex items-center gap-3 rounded-[12px] border bg-canvas-card px-4 py-3 text-sm font-bold backdrop-blur-md",
        "animate-slide-in-right shadow-[0_8px_30px_rgba(0,0,0,0.4)]",
        borders[toast.variant],
      ].join(" ")}
      role="alert"
    >
      {icons[toast.variant]}
      <span className="flex-1 text-text-primary">{toast.message}</span>
      <button
        onClick={onDismiss}
        className="shrink-0 text-text-muted hover:text-text-primary transition-colors cursor-pointer"
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
