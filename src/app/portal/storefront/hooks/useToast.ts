import { useCallback, useEffect, useState } from "react";

export function useToast(durationMs = 3200) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Toast auto-dismiss
  useEffect(() => {
    if (!toastMessage) return;
    const timer = setTimeout(() => setToastMessage(null), durationMs);
    return () => clearTimeout(timer);
  }, [toastMessage, durationMs]);

  const triggerToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  return { toastMessage, triggerToast };
}
