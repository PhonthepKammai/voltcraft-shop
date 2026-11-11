"use client";

import {
  createContext,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Toast, type ToastData, type ToastType } from "./toast";

export interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
  hideToast: () => void;
}

export const ToastContext = createContext<ToastContextValue | null>(
  null
);

const DURATION_MS = 3500;

// Put this once in app/layout.tsx so a toast survives route changes
// (e.g. "Account created" shown after redirecting to /login).
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);
  const timer = useRef<number | null>(null);

  const hideToast = useCallback(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success") => {
      if (timer.current) window.clearTimeout(timer.current);
      setToast({ message, type });
      timer.current = window.setTimeout(() => {
        setToast(null);
        timer.current = null;
      }, DURATION_MS);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {toast && <Toast toast={toast} onDismiss={hideToast} />}
    </ToastContext.Provider>
  );
}