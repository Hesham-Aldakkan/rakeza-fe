import { useState, useCallback, useRef } from 'react';
import { fetchWithRetry, RakeError } from '@/lib/api-client';
import type { ApiError } from '@/types';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

export function useApi<T = unknown>(
  url: string,
  options?: RequestInit & { timeout?: number; maxRetries?: number }
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: true,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const fetch = useCallback(async () => {
    abortControllerRef.current = new AbortController();

    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await fetchWithRetry<T>(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });
      setState({ data, isLoading: false, error: null });
      return data;
    } catch (err) {
      const error = err instanceof RakeError ? err : new Error(String(err));
      setState({
        data: null,
        isLoading: false,
        error: error as ApiError,
      });
      throw error;
    }
  }, [url, options]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    ...state,
    fetch,
    cancel,
  };
}

interface UseMutationState<T> {
  data: T | null;
  isLoading: boolean;
  error: ApiError | null;
}

export function useMutation<T = unknown>(
  url: string,
  method: 'POST' | 'PUT' | 'DELETE' = 'POST',
  options?: RequestInit & { timeout?: number; maxRetries?: number }
) {
  const [state, setState] = useState<UseMutationState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  const mutate = useCallback(
    async (payload?: Record<string, unknown>) => {
      abortControllerRef.current = new AbortController();

      try {
        setState((prev) => ({ ...prev, isLoading: true, error: null }));

        const fetchOptions: RequestInit & { timeout?: number; maxRetries?: number } = {
          method,
          ...options,
          signal: abortControllerRef.current.signal,
        };

        if (payload && method !== 'DELETE') {
          fetchOptions.headers = {
            'Content-Type': 'application/json',
            ...fetchOptions.headers,
          };
          fetchOptions.body = JSON.stringify(payload);
        }

        const data = await fetchWithRetry<T>(url, fetchOptions);
        setState({ data, isLoading: false, error: null });
        return data;
      } catch (err) {
        const error = err instanceof RakeError ? err : new Error(String(err));
        setState({
          data: null,
          isLoading: false,
          error: error as ApiError,
        });
        throw error;
      }
    },
    [url, method, options]
  );

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return {
    ...state,
    mutate,
    cancel,
  };
}
