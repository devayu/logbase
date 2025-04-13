export type ApiState<T> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
};

export type MutationTrigger<T, P> = {
  data: T | null;
  error: string | null;
  isLoading: boolean;
  trigger: (params: P) => Promise<T | null>;
  subscribe: (callback: (state: ApiState<T>) => void) => () => void;
};

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjbGllbnRfaWQiOiJkNGMyNjUwMTcxZmMyNDZiZTMzMjI2OTBjNGJlNGEzYjE3MTk0MjNjNmM2ZjU4OTE0YWNkNDQ5N2Q3NTk3OGYwIiwiaWF0IjoxNzQ0NTYwNTkzfQ.uFNiygCbVC8PPkruvwKKJcE8ASXhkDt_KVtpYjrkl8A";

export class Api {
  private static instance: Api;
  private baseUrl: string;

  private constructor() {
    this.baseUrl =
      process.env.NEXT_PUBLIC_SIMPLE_LOG_URL || "http://localhost:3090";
  }

  public static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  createMutation<T, P>(
    endpoint: string,
    options?: RequestInit
  ): MutationTrigger<T, P> {
    let state: ApiState<T> = {
      data: null,
      error: null,
      isLoading: false,
    };

    let stateUpdateCallback: ((state: ApiState<T>) => void) | null = null;

    const updateState = (newState: Partial<ApiState<T>>) => {
      state = { ...state, ...newState };
      if (stateUpdateCallback) {
        stateUpdateCallback(state);
      }
    };

    const trigger = async (params: P): Promise<T | null> => {
      updateState({ isLoading: true, error: null });

      try {
        const response = await fetch(`${this.baseUrl}${endpoint}`, {
          method: "POST",
          ...options,
          body: JSON.stringify(params),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options?.headers,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateState({ data, isLoading: false });
        return data;
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        updateState({ error: errorMessage, isLoading: false });
        return null;
      }
    };

    return {
      ...state,
      trigger,
      subscribe: (callback: (state: ApiState<T>) => void) => {
        stateUpdateCallback = callback;
        return () => {
          stateUpdateCallback = null;
        };
      },
    };
  }

  async fetch<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<ApiState<T>> {
    /* eslint-disable prefer-const */
    let state: ApiState<T> = {
      data: null,
      error: null,
      isLoading: false,
    };
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        method: "GET",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...options?.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      state.data = data;
    } catch (error) {
      state.error =
        error instanceof Error ? error.message : "An error occurred";
    } finally {
      state.isLoading = false;
      return state;
    }
  }
}

export const api = Api.getInstance();
