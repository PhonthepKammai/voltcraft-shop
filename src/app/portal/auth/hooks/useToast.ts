import { useCallback, useState } from "react";
import { TOAST_DURATION_MS } from "../constants";
import type { ToastData, ToastType } from "../types";

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });

    window.setTimeout(() => {
      setToast((current) => (current?.message === message ? null : current));
    }, TOAST_DURATION_MS);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, showToast, dismissToast };
}
