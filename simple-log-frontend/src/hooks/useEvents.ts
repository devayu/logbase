import { BaseParams, BaseResponse, useApiMutation } from "@/hooks/useApi";
import { Api, ApiState } from "@/services/api";

export interface Event {
  id: number;
  event: string;
  timestamp: string;
  metadata: Record<string, any>;
}

export async function getServerProjects(): Promise<ApiState<Event[]>> {
  return await Api.getInstance().fetch<Event[]>("/getEvents", {});
}

export function useGetAllEvents() {
  const mutation = useApiMutation<BaseResponse, BaseParams>();

  const getAllEvents = async (projectId: number) => {
    return mutation.mutate("/getEvents", { projectId }, { method: "POST" });
  };

  return {
    getAllEvents,
    isLoading: mutation.isLoading,
    error: mutation.error,
    data: mutation.data,
  };
}

interface GetEventsOverviewResponse extends BaseResponse {
  events: Event[];
  overview: {
    total_events: number;
    growth_percentage: number;
    previous_count: number;
    active_users: {
      current: number;
      previous: number;
      growth_percentage: number;
    };
  };
}
export function useGetEventsOverview() {
  const mutation = useApiMutation<GetEventsOverviewResponse, BaseParams>();

  const getEventsOverview = async (projectId: number) => {
    return mutation.mutate(
      "/getEventsOverview",
      { projectId },
      { method: "POST" }
    );
  };

  return {
    getEventsOverview,
    isLoading: mutation.isLoading,
    error: mutation.error,
    data: mutation.data,
  };
}
