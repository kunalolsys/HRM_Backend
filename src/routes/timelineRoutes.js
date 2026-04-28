import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  getTimeline,
  updateTimeline,
} from "../controllers/timeLineController.js";

const router = Router();
router.use(authenticate);
router.get("/", hasPermission("manage_timelines"), getTimeline);
router.put("/:id", hasPermission("manage_timelines"), updateTimeline);

export default router;
