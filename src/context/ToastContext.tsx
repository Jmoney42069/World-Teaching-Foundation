import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";

/* ─── Types ─── */

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  exiting: boolean;
}

interface ToastContextType {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const TOAST_DURATION = 3000;
const EXIT_DURATION = 300;

const icons: Record<ToastType, string> = {
  success: "✅",
  error: "❌",
  info: "ℹ️",
};

const colors: Record<ToastType, string> = {
  success: "border-success/30 bg-success-soft",
  error: "border-error/30 bg-error-soft",
  info: "border-info/30 bg-info-soft",
};

const progressColors: Record<ToastType, string> = {
  success: "bg-success",
  error: "bg-error",
  info: "bg-info",
};

/* ─── Context ─── */

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)));
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_DURATION);
  }, []);

  const addToast = useCallback(
    (type: ToastType, message: string) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, message, exiting: false }]);
      setTimeout(() => removeToast(id), TOAST_DURATION);
    },
    [removeToast]
  );

  const value: ToastContextType = {
    success: useCallback((msg: string) => addToast("success", msg), [addToast]),
    error: useCallback((msg: string) => addToast("error", msg), [addToast]),
    info: useCallback((msg: string) => addToast("info", msg), [addToast]),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}

/* ─── Toast Container ─── */

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;

  return (
    <>
      {/* Mobile: bottom-center */}
      <div
        className="fixed inset-x-0 bottom-20 z-[60] flex flex-col items-center gap-2 px-4 sm:hidden"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
      {/* Desktop: top-right */}
      <div
        className="fixed top-4 right-4 z-[60] hidden flex-col gap-2 sm:flex"
        role="region"
        aria-label="Notifications"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </div>
    </>
  );
}

/* ─── Single Toast ─── */

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  return (
    <div
      role="alert"
      onClick={() => onDismiss(toast.id)}
      className={`glass-strong relative w-full max-w-sm cursor-pointer overflow-hidden rounded-xl border px-4 py-3 shadow-elevated transition-all ${
        mounted && !toast.exiting
          ? "translate-y-0 scale-100 opacity-100"
          : "translate-y-4 scale-95 opacity-0"
      } ${colors[toast.type]}`}
      style={{ transitionDuration: `${EXIT_DURATION}ms` }}
    >
      <div className="flex items-center gap-3">
        <span className="text-base" aria-hidden="true">
          {icons[toast.type]}
        </span>
        <p className="flex-1 text-sm font-medium text-primary">{toast.message}</p>
      </div>
      {/* Progress bar */}
      <div className="absolute inset-x-0 bottom-0 h-0.5">
        <div
          className={`h-full ${progressColors[toast.type]}`}
          style={{
            animation: `toast-progress ${TOAST_DURATION}ms linear forwards`,
          }}
        />
      </div>
    </div>
  );
}
