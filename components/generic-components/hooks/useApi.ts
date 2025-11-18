import { useCallback } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const useApi = () => {
  const request = useCallback(
    async <T = unknown>(endpoint: string, options: RequestInit = {}): Promise<T> => {
      try {
        const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}${endpoint}`;

        const response = await fetch(url, {
          headers: {
            "Content-Type": "application/json",
            ...options.headers,
          },
          ...options,
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
        }

        const responseText = await response.text();

        if (!responseText) {
          return null as T;
        }

        return JSON.parse(responseText) as T;
      } catch (error) {
        throw error;
      }
    },
    []
  );

  const get = useCallback(
    <T = unknown>(endpoint: string): Promise<T> => request<T>(endpoint),
    [request]
  );

  const post = useCallback(
    <T = unknown>(endpoint: string, data: unknown): Promise<T> =>
      request<T>(endpoint, { method: "POST", body: JSON.stringify(data) }),
    [request]
  );

  const put = useCallback(
    <T = unknown>(endpoint: string, data: unknown): Promise<T> =>
      request<T>(endpoint, { method: "PUT", body: JSON.stringify(data) }),
    [request]
  );

  const patch = useCallback(
    <T = unknown>(endpoint: string, data: unknown): Promise<T> =>
      request<T>(endpoint, { method: "PATCH", body: JSON.stringify(data) }),
    [request]
  );

  const del = useCallback(
    <T = unknown>(endpoint: string): Promise<T> => request<T>(endpoint, { method: "DELETE" }),
    [request]
  );

  return { get, post, put, patch, delete: del };
};

export default useApi;
