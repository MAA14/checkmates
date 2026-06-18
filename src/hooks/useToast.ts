import { useCallback, useState } from "react";
import { TToast, TToastType } from "@/components/types/TToast";

/**
 * Custom hook for managing toast notifications
 * @returns Toast state, show/hide functions
 */
export function useToast() {
  const [toast, setToast] = useState<TToast | null>(null);

  const showToast = useCallback(
    (message: string, type: TToastType = "info", duration: number = 4000) => {
      setToast({ message, type });

      const timer = setTimeout(() => {
        setToast(null);
      }, duration);

      return () => clearTimeout(timer);
    },
    [],
  );

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return { toast, showToast, hideToast };
}
