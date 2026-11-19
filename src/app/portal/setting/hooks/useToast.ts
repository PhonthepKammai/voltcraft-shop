import { useCallback, useEffect, useState } from "react";
import { TOAST_DURATION_MS } from "../constants";
import type { ToastState, TriggerToast } from "../types";

export function useToast() {
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), TOAST_DURATION_MS);
    return () => clearTimeout(timer);
  }, [toast]);

  const triggerToast: TriggerToast = useCallback((title, detail, tone = "emerald") => {
    setToast({ title, detail, tone });
  }, []);

  return { toast, setToast, triggerToast };
}
