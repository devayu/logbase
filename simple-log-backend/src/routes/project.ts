import { Router } from "express";

import {
  getProjects,
  createProject,
  verifyProjectKey,
  deleteProject,
} from "../controllers/project.controller";
import {
  authenticateProject,
  authenticateToken,
} from "../middleware/authentication.middleware";
import jwt from "jsonwebtoken";

const router = Router();

router.get("/getProjects", authenticateToken, getProjects);
router.get("/verifyProjectKey", authenticateProject, verifyProjectKey);
router.get("/generateClient", (req, res) => {
  const auth_token = jwt.sign(
    { client_id: req.body.client_id },
    process.env.JWT_SECRET!!
  );
  res.json({ auth_token });
});
router.post("/createProject", authenticateToken, createProject);
router.delete("/deleteProject", authenticateToken, deleteProject);
export default router;
