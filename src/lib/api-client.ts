import { getConfig } from './config';
import type { ApiResponse, ApiError } from '@/types';

class RakeError extends Error implements ApiError {
  code: string;
  statusCode: number;
  traceId?: string;
  details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number,
    code: string = 'UNKNOWN_ERROR',
    traceId?: string,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'RakeError';
    this.statusCode = statusCode;
    this.code = code;
    this.traceId = traceId;
    this.details = details;
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
  maxRetries?: number;
  retryDelay?: number;
  retryableStatuses?: number[];
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function fetchWithRetry<T = unknown>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const config = getConfig();
  const {
    timeout = config.api.timeoutMs,
    maxRetries = config.api.maxRetries,
    retryDelay = config.api.retryDelayMs,
    retryableStatuses = [408, 429, 500, 502, 503, 504],
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  let attempt = 0;

  while (attempt <= maxRetries) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorData: Partial<ApiResponse<unknown>> = {};

        if (contentType?.includes('application/json')) {
          try {
            errorData = await response.json();
          } catch {
            // Ignore JSON parse errors
          }
        }

        const error = new RakeError(
          errorData.error?.message || `HTTP ${response.status}`,
          response.status,
          errorData.error?.code || `HTTP_${response.status}`,
          errorData.traceId,
          errorData.error?.details
        );

        // Check if we should retry
        if (retryableStatuses.includes(response.status) && attempt < maxRetries) {
          lastError = error;
          attempt++;
          await sleep(retryDelay * Math.pow(2, attempt - 1));
          continue;
        }

        throw error;
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new RakeError('Invalid response format', 500, 'INVALID_RESPONSE');
      }

      const data = (await response.json()) as ApiResponse<T>;

      if (!data.success) {
        throw new RakeError(
          data.error?.message || 'API error',
          500,
          data.error?.code || 'API_ERROR',
          data.traceId,
          data.error?.details
        );
      }

      return data.data as T;
    } catch (error) {
      if (error instanceof RakeError) {
        throw error;
      }

      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        lastError = error;
        attempt++;
        if (attempt <= maxRetries) {
          await sleep(retryDelay * Math.pow(2, attempt - 1));
          continue;
        }
      }

      throw error;
    }
  }

  throw lastError || new RakeError('Max retries exceeded', 0, 'MAX_RETRIES_EXCEEDED');
}

export async function fetchJson<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return fetchWithRetry<T>(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });
}

export async function postJson<T = unknown>(
  url: string,
  data: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  return fetchJson<T>(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options,
  });
}

export async function putJson<T = unknown>(
  url: string,
  data: Record<string, unknown>,
  options?: FetchOptions
): Promise<T> {
  return fetchJson<T>(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options,
  });
}

export async function deleteJson<T = unknown>(
  url: string,
  options?: FetchOptions
): Promise<T> {
  return fetchJson<T>(url, {
    method: 'DELETE',
    ...options,
  });
}

// SSE Helper for streaming
export async function fetchSSE(
  url: string,
  callback: (message: string) => void,
  signal?: AbortSignal,
  onError?: (error: Error) => void
): Promise<void> {
  const config = getConfig();

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'text/event-stream',
      },
      signal,
    });

    if (!response.ok) {
      throw new RakeError(`HTTP ${response.status}`, response.status);
    }

    if (!response.body) {
      throw new RakeError('No response body', 500);
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let lastHeartbeat = Date.now();
    const heartbeatTimeout = config.streaming.heartbeatMs;

    const heartbeatTimer = setInterval(() => {
      if (Date.now() - lastHeartbeat > heartbeatTimeout) {
        reader.cancel();
        clearInterval(heartbeatTimer);
        if (onError) {
          onError(new RakeError('Heartbeat timeout', 0, 'HEARTBEAT_TIMEOUT'));
        }
      }
    }, heartbeatTimeout / 2);

    try {
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          clearInterval(heartbeatTimer);
          break;
        }

        lastHeartbeat = Date.now();
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              clearInterval(heartbeatTimer);
              return;
            }
            try {
              callback(data);
            } catch (error) {
              clearInterval(heartbeatTimer);
              throw error;
            }
          }
        }
      }
    } finally {
      clearInterval(heartbeatTimer);
      reader.releaseLock();
    }
  } catch (error) {
    if (signal?.aborted) {
      // Silently handle abort
      return;
    }

    const err = error instanceof Error ? error : new Error(String(error));
    if (onError) {
      onError(err);
    } else {
      throw err;
    }
  }
}

// Helper to build API URLs
export function buildUrl(path: string, params?: Record<string, string | number | boolean>): string {
  const config = getConfig();
  const url = new URL(path, config.api.baseUrl);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, String(value));
    });
  }

  return url.toString();
}

export { RakeError };
