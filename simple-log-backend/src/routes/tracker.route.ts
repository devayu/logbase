import { Router } from "express";
import { trackEvent } from "../controllers/tracker.controller";
import { authenticateProject } from "../middleware/authentication.middleware";

const router = Router();
router.post("/trackEvent", authenticateProject, trackEvent);
export default router;
