"use server";
import { getClientId } from "@/auth/currentUser";
import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/utils";
import { ProjectIdSchema, ProjectIdT } from "@/prismaTypes";
import { z } from "zod";

export const getProjectsAction = async (client_id?: string) => {
  if (!client_id) {
    return;
  }

  const projects = await prisma.project.findMany({
    where: {
      clientId: client_id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects;
};
export const getProjectAction = async (project_id: ProjectIdT) => {
  const { success } = ProjectIdSchema.safeParse(project_id);
  if (!success) {
    return null;
  }
  const project = await prisma.project.findFirst({
    where: {
      id: project_id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return project;
};

const CreateProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
});
export type CreateProjectT = z.infer<typeof CreateProjectSchema>;

export const createProjectAction = async (
  createProjectParams: CreateProjectT
) => {
  const { success, data } = CreateProjectSchema.safeParse(createProjectParams);

  if (!success) {
    return;
  }
  const { name, description } = data;
  const apiKey = generateApiKey();
  const clientId = await getClientId();
  const project = await prisma.project.create({
    data: {
      name,
      description,
      clientId,
      apiKey,
    },
  });
  return project;
};

export const deleteProjectAction = async (project_id: ProjectIdT) => {
  const { success } = ProjectIdSchema.safeParse(project_id);
  if (!success) {
    return;
  }
  const clientId = await getClientId();
  try {
    const project = await prisma.project.delete({
      where: {
        id: project_id,
        clientId,
      },
    });
    return project;
  } catch (error) {
    console.log(error);
    return;
  }
};

const ToogleProjectStatusSchema = z.object({
  projectId: z.number(),
  currentStatus: z.string(),
});
export type ToggleProjectStatusT = z.infer<typeof ToogleProjectStatusSchema>;

export const toggleProjectStatusAction = async (
  toogleProjectParams: ToggleProjectStatusT
) => {
  const { success, data } =
    ToogleProjectStatusSchema.safeParse(toogleProjectParams);
  if (!success) {
    return;
  }
  const { projectId: project_id, currentStatus } = data;
  const clientId = await getClientId();
  console.log(project_id, clientId, currentStatus);
  const updatedProject = await prisma.project.update({
    where: {
      id: project_id,
      clientId,
    },
    data: {
      status: currentStatus === "PAUSED" ? "ACTIVE" : "PAUSED",
      updatedAt: new Date(),
    },
  });
  return updatedProject;
};

export const updateProjectKeyAction = async (project_id: ProjectIdT) => {
  const { success } = ProjectIdSchema.safeParse(project_id);
  if (!success) {
    return;
  }
  const clientId = await getClientId();
  const updatedProject = await prisma.project.update({
    where: {
      id: project_id,
      clientId,
    },
    data: {
      apiKey: generateApiKey(),
      updatedAt: new Date(),
    },
  });
  return updatedProject;
};

const UpdateProjectSchema = z.object({
  name: z.string().min(3),
  description: z.string().min(3),
  projectId: z.number(),
});
export type UpdateProjectSchemaT = z.infer<typeof UpdateProjectSchema>;

export const updateProjectAction = async (
  updateProjectParams: UpdateProjectSchemaT
) => {
  const { success, data: parsedData } =
    UpdateProjectSchema.safeParse(updateProjectParams);

  if (!success) {
    return;
  }
  const { name, description, projectId } = parsedData;
  const clientId = await getClientId();
  const updatedProject = await prisma.project.update({
    where: {
      id: projectId,
      clientId,
    },
    data: {
      name,
      description,
      updatedAt: new Date(),
    },
  });
  return updatedProject;
};
