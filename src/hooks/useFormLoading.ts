import { useCallback, useState } from "react";

/**
 * Custom hook for managing form loading state
 * @returns Loading state and functions to manage it
 */
export function useFormLoading() {
  const [loading, setLoading] = useState(false);

  const setLoadingTrue = useCallback(() => setLoading(true), []);
  const setLoadingFalse = useCallback(() => setLoading(false), []);

  return { loading, setLoadingTrue, setLoadingFalse };
}
