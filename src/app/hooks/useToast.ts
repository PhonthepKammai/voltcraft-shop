"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import type { BaseToastData, ToastVariant } from "@/components/ui/BaseToast";

export function useToast(defaultDuration = 3500) {
  const [toast, setToast] = useState<BaseToastData | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismissToast = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setToast(null);
  }, []);

  const showToast = useCallback(
    (
      input: string | BaseToastData,
      variant: ToastVariant = "info",
      duration = defaultDuration
    ) => {
      if (timerRef.current) clearTimeout(timerRef.current);

      const data: BaseToastData =
        typeof input === "string" ? { title: input, variant } : input;

      setToast(data);

      if (duration > 0) {
        timerRef.current = setTimeout(() => {
          setToast(null);
        }, duration);
      }
    },
    [defaultDuration]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { toast, showToast, dismissToast };
}