import { Request, Response } from "express";
import { db } from "../db";
import { projectsTable } from "../db/schema";
import { AuthRequest } from "../middleware/authentication.middleware";
import { generateApiKey } from "../utils/apiKeys";
import { eq } from "drizzle-orm";

export const verifyProjectKey = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.project_id) {
    res.status(403).json({
      status: "error",
      message: "Invalid request",
    });
  }
  const { project_id } = req;
  const project = await db
    .select({ projectPlan: projectsTable.plan })
    .from(projectsTable)
    .where(eq(projectsTable.id, project_id as number))
    .limit(1);
  res.status(200).json({
    projectPlan: project[0].projectPlan,
    canAutoTrackEvents: project[0].projectPlan === "PREMIUM",
  });
};
export const getProjects = async (_: Request, res: Response): Promise<void> => {
  try {
    res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Internal server error",
    });
  }
};

export const registerProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { body } = req;
  if (!body || !body.projectName) {
    res.status(403).json({
      status: "error",
      message: "Invalid request",
    });
  }
  if (!req.client_id) {
    res.status(401).json({
      status: "error",
      message: "Invalid request client id is missing",
    });
  }
  const { projectName } = body;
  const project = await db.transaction(async (tx) => {
    const [newProject] = await tx
      .insert(projectsTable)
      .values({
        name: projectName,
        client_id: req.client_id as string,
      })
      .returning();

    const apiKey = generateApiKey();
    await tx
      .update(projectsTable)
      .set({ api_key: apiKey })
      .where(eq(projectsTable.id, newProject.id))
      .execute();

    return {
      ...newProject,
      api_key: apiKey,
    };
  });
  res.status(200).json({
    status: "ok",
    project,
  });
};
