import { useApiMutation, useApiQuery } from "./useApi";
import { ApiState, Api } from "@/services/api";

export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: "ACTIVE" | "PAUSED";
  plan: "BASIC" | "PREMIUM";
  apiKey: string;
}

interface BaseResponse {
  status: string;
  message?: string;
}

interface BaseParams {
  projectId: number;
}

type CreateProjectParams = {
  projectName: string;
  description: string;
};
export async function getServerProjects(): Promise<ApiState<Project[]>> {
  return await Api.getInstance().fetch<Project[]>("/getProjects", {});
}
export function useDeleteProject() {
  const mutation = useApiMutation<BaseResponse, BaseParams>();

  const deleteProject = async (projectId: number) => {
    return mutation.mutate(
      "/deleteProject",
      { projectId },
      { method: "DELETE" }
    );
  };

  return {
    deleteProject,
    isLoading: mutation.isLoading,
    error: mutation.error,
    data: mutation.data,
  };
}
export function useCreateProject() {
  const mutation = useApiMutation<BaseResponse, CreateProjectParams>();

  const createProject = async (projectParams: CreateProjectParams) => {
    return mutation.mutate("/createProject", projectParams, {
      method: "POST",
      cache: "no-store",
    });
  };

  return {
    createProject,
    isLoading: mutation.isLoading,
    error: mutation.error,
    data: mutation.data,
  };
}

export function useUpdateProjectKey() {
  const mutation = useApiMutation<BaseResponse, BaseParams>();

  const updateProjectKey = async (
    projectId: BaseParams
  ): Promise<BaseResponse> => {
    return mutation.mutate("/updateProjectKey", projectId, {
      method: "PUT",
      cache: "no-store",
    });
  };

  return {
    updateProjectKey,
    isLoading: mutation.isLoading,
    error: mutation.error,
    data: mutation.data,
  };
}

interface ToggleProjectStatus extends BaseParams {
  status: "ACTIVE" | "PAUSED";
}
export function useToggleProjectStatus() {
  const mutation = useApiMutation<BaseResponse, ToggleProjectStatus>();

  const toggleProjectStatus = async (
    toggleProjectStatus: ToggleProjectStatus
  ): Promise<BaseResponse> => {
    return mutation.mutate("/toggleProjectStatus", toggleProjectStatus, {
      method: "PUT",
      cache: "no-store",
    });
  };

  return {
    toggleProjectStatus,
    isLoading: mutation.isLoading,
    error: mutation.error,
    data: mutation.data,
  };
}
export function useGetProjects() {
  return useApiQuery<Project[]>("/getProjects", { cache: "no-store" });
}
