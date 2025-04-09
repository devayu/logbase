import { Router } from "express";
import { randomBytes } from "crypto";

import {
  getProjects,
  registerProject,
  verifyProjectKey,
} from "../controllers/project.controller";
import {
  authenticateProject,
  authenticateToken,
} from "../middleware/authentication.middleware";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/getProjects", getProjects);
router.get("/verifyProjectKey", authenticateProject, verifyProjectKey);
router.get("/genereteClient", (_, res) => {
  const auth_token = jwt.sign(
    { client_id: randomBytes(32).toString("hex") },
    process.env.JWT_SECRET!!
  );
  res.json({ auth_token });
});
router.post("/createProject", authenticateToken, registerProject);
export default router;
