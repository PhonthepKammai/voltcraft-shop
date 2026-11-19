import { useCallback, useState } from "react";
import { TOAST_DURATION_MS } from "../constants";
import type { ToastData, ToastType } from "../types";

export function useToast() {
  const [toast, setToast] = useState<ToastData | null>(null);

  const triggerToast = useCallback((message: string, type: ToastType = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast((prev) => (prev?.message === message ? null : prev));
    }, TOAST_DURATION_MS);
  }, []);

  const dismissToast = useCallback(() => setToast(null), []);

  return { toast, triggerToast, dismissToast };
}
