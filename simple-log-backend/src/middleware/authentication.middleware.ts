import { NextFunction, Request, Response } from "express";

import jwt, { JwtPayload } from "jsonwebtoken";
import { db } from "../db";
import { projectsTable } from "../db/schema";
import { eq } from "drizzle-orm";

export interface AuthRequest extends Request {
  client_id?: string | JwtPayload;
  project_id?: number | JwtPayload;
}
export function authenticateToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  try {
    const { client_id } = jwt.verify(token, process.env.JWT_SECRET!!) as {
      client_id: string;
    };
    req.client_id = client_id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid token" });
    return;
  }
}

export async function authenticateProject(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }
  try {
    const project = await db
      .select({ id: projectsTable.id })
      .from(projectsTable)
      .where(eq(projectsTable.api_key, token))
      .limit(1);
    if (project.length === 0) {
      res.status(403).json({ message: "Invalid Project token" });
      return;
    }
    req.project_id = project[0].id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Invalid Project token" });
    return;
  }
}
