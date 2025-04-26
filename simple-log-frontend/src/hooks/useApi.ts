"use client";
import { useState, useCallback } from "react";
import { api, ApiState } from "../services/api";

export interface BaseResponse {
  status: string;
  message?: string;
}

export interface BaseParams {
  projectId: number;
}

export function useApiMutation<T, P>() {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const mutate = useCallback(
    async (endpoint: string, params: P, options?: RequestInit) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      try {
        const response = await fetch(`${api.baseUrl}${endpoint}`, {
          method: "POST",
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${api.token}`,
            ...options?.headers,
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setState({ data, error: null, isLoading: false });
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        setState((prev) => ({
          ...prev,
          error: errorMessage,
          isLoading: false,
        }));
        return null;
      }
    },
    []
  );

  return { ...state, mutate };
}

export function useApiQuery<T>(endpoint: string, options?: RequestInit) {
  const [state, setState] = useState<ApiState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const fetchData = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    const result = await api.fetch<T>(endpoint, options);
    setState(result);
  }, [endpoint, options]);

  return { ...state, refetch: fetchData };
}
