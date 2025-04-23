import { Router } from "express";
import {
  trackEvent,
  getAllEvents,
  getEventsOverview,
} from "../controllers/tracker.controller";
import {
  authenticateProject,
  authenticateToken,
} from "../middleware/authentication.middleware";

const router = Router();
router.post("/trackEvent", authenticateProject, trackEvent);
router.post("/getEvents", authenticateToken, getAllEvents);
router.post("/getEventsOverview", authenticateToken, getEventsOverview);
export default router;
