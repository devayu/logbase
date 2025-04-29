"use server";
import { getClientId } from "@/auth/currentUser";
import { prisma } from "@/lib/db";
import { generateApiKey } from "@/lib/utils";
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
export const getProjectAction = async (project_id: number) => {
  if (!project_id || isNaN(project_id)) {
    return;
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
  const { name, description } = CreateProjectSchema.parse(createProjectParams);

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

export const deleteProjectAction = async (project_id: number | null) => {
  if (!project_id || isNaN(project_id)) {
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
