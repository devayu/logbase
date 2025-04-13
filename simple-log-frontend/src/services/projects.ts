import { Api, ApiState } from "@/services/api";

export interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  status: string;
}
export interface Event {
  id: number;
  event: string;
  timestamp: string;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  metadata: Record<string, any>;
}

export async function getProjects(): Promise<ApiState<Project[]>> {
  return Api.getInstance().fetch("/getProjects", {
    cache: "no-store",
  });
}

type CreateProjectParams = {
  projectName: string;
  description: string;
};

export const createProjectMutation = Api.getInstance().createMutation<
  Project,
  CreateProjectParams
>("/createProject", {
  cache: "no-store",
});

export const createDeleteProjectMutation = Api.getInstance().createMutation<
  { status: string },
  { projectId: number }
>("/deleteProject", {
  cache: "no-store",
  method: "DELETE",
});
