import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createMyGoals,
  getMyGoals,
  updateMyGoals,
  submitMyGoals,
  getTeamGoals,
  approveTeamGoal,
  deleteMyGoals,
} from "../controllers/myGoals.controller.js";

const router = Router();
router.use(authenticate);

router.post("/", createMyGoals); // POST /api/myGoals/
router.get("/my/:timelineId", getMyGoals); // GET /api/myGoals/my/:timelineId
router.put("/:id", updateMyGoals);
router.post("/:id/submit", submitMyGoals);
router.get("/team/:timelineId", hasPermission("approve_team_goals"), getTeamGoals); // manager
router.post("/team/:id/approve", hasPermission("approve_team_goals"), approveTeamGoal);
router.delete("/:id", deleteMyGoals);

export default router;

