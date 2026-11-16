import { useCallback, useEffect, useState } from "react";
import { TOAST_DURATION_MS } from "../constants";
import type { ShowToast, ToastState } from "../types";

export function useToast() {
  const [toastMessage, setToastMessage] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const showToast: ShowToast = useCallback((title, detail, tone = "success") => {
    setToastMessage({ title, detail, tone });
  }, []);

  const dismissToast = useCallback(() => setToastMessage(null), []);

  return { toastMessage, showToast, dismissToast };
}
