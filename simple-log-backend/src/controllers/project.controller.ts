import { Response } from "express";
import { db } from "../db";
import { eventsTable, projectsTable } from "../db/schema";
import { AuthRequest } from "../middleware/authentication.middleware";
import { generateApiKey } from "../utils/apiKeys";
import { and, desc, eq } from "drizzle-orm";

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
export const getProjects = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  if (!req.client_id) {
    res.status(401).json({
      status: "error",
      message: "Invalid request client id is missing",
    });
  }
  const { client_id } = req;
  const projects = await db
    .select({
      id: projectsTable.id,
      description: projectsTable.description,
      name: projectsTable.name,
      plan: projectsTable.plan,
      createdAt: projectsTable.created_at,
      updatedAt: projectsTable.updated_at,
      status: projectsTable.status,
    })
    .from(projectsTable)
    .where(eq(projectsTable.client_id, client_id as string))
    .orderBy(desc(projectsTable.created_at));
  res.status(200).json(projects);
};
export const getProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const project_id = Number(req.params.id);
  if (isNaN(project_id)) {
    res.status(403).json({
      status: "error",
      message: "Invalid request",
    });
    return;
  }
  if (!req.client_id && !project_id) {
    res.status(401).json({
      status: "error",
      message: "Invalid request client id is missing",
    });
  }
  const { client_id } = req;
  const [project] = await db
    .select({
      id: projectsTable.id,
      description: projectsTable.description,
      name: projectsTable.name,
      plan: projectsTable.plan,
      createdAt: projectsTable.created_at,
      updatedAt: projectsTable.updated_at,
      status: projectsTable.status,
      apiKey: projectsTable.api_key,
    })
    .from(projectsTable)
    .where(
      and(
        eq(projectsTable.client_id, client_id as string),
        eq(projectsTable.id, project_id as number)
      )
    )
    .orderBy(desc(projectsTable.created_at));
  res.status(200).json(project);
};
export const updateProjectKey = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { body } = req;
  if (!body || !body.projectId) {
    res.status(403).json({
      status: "error",
      message: "Invalid request",
    });
    return;
  }
  if (!req.client_id) {
    res.status(401).json({
      status: "error",
      message: "Invalid request client id is missing",
    });
    return;
  }
  const { projectId } = body;
  const updatedKey = generateApiKey();
  const projectUpdated = await db
    .update(projectsTable)
    .set({
      api_key: updatedKey,
      updated_at: new Date(),
    })
    .where(
      and(
        eq(projectsTable.client_id, req.client_id as string),
        eq(projectsTable.id, projectId as number)
      )
    );

  if (projectUpdated.count === 0) {
    res.status(500).json({
      status: "error",
      message: "Unable to generate key api key",
    });
    return;
  }
  res.status(200).json({
    status: "ok",
  });
};
export const createProject = async (
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
  const { projectName, description } = body;
  const project = await db.transaction(async (tx) => {
    const [newProject] = await tx
      .insert(projectsTable)
      .values({
        name: projectName,
        description: description,
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
  res.status(200).json(project);
};

export const deleteProject = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { body } = req;
  if (!body || !body.projectId) {
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
  const { projectId } = body;
  const project = await db.transaction(async (tx) => {
    await tx
      .delete(eventsTable)
      .where(eq(eventsTable.project_id, projectId as number));

    const projectDeleted = await tx
      .delete(projectsTable)
      .where(
        and(
          eq(projectsTable.client_id, req.client_id as string),
          eq(projectsTable.id, projectId as number)
        )
      );

    if (projectDeleted.count === 0) {
      return {
        status: "error",
        message: "Unable to delete project",
      };
    }

    return {
      status: "ok",
    };
  });

  if (project.status === "ok") {
    res.status(200).json(project);
  } else {
    res.status(500).json(project);
  }
};

export const toggleProjectStatus = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const { body } = req;
  if (!body || !body.projectId) {
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
  const { projectId, status } = body;
  const projectUpdated = await db
    .update(projectsTable)
    .set({
      status: status === "PAUSED" ? "ACTIVE" : "PAUSED",
      updated_at: new Date(),
    })
    .where(
      and(
        eq(projectsTable.client_id, req.client_id as string),
        eq(projectsTable.id, projectId as number)
      )
    );

  if (projectUpdated.count === 0) {
    res.status(500).json({
      status: "error",
      message: "Unable to delete project",
    });
  }
  res.status(200).json({
    status: "ok",
  });
};
