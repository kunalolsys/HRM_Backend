import express from "express";
import * as myGoalController from "../controllers/myGoals.controller.js";
import { authenticate, hasPermission } from "../middlewares/auth.js";

const router = express.Router();

// 🔐 All routes require auth
router.use(authenticate);

// ─────────────────────────────────────────────
// 🔹 Initialize My Goals (create once per year)
// ─────────────────────────────────────────────
router.post(
  "/init",
  hasPermission("manage_own_goals"),
  myGoalController.initMyGoals,
);

// ─────────────────────────────────────────────
// 🔹 Import from Global Goal Library
// ─────────────────────────────────────────────
router.post(
  "/import",
  hasPermission("manage_own_goals"),
  myGoalController.importFromLibrary,
);

// ─────────────────────────────────────────────
// 🔹 Cascade Manager Goals
// ─────────────────────────────────────────────
router.post(
  "/cascade",
  hasPermission("manage_own_goals"),
  myGoalController.cascadeManagerGoals,
);

// ─────────────────────────────────────────────
// 🔹 Get My Goals
// ─────────────────────────────────────────────
router.get("/", hasPermission("manage_own_goals"), myGoalController.getMyGoals);

// ─────────────────────────────────────────────
// 🔹 Get My Manager Goals
// ─────────────────────────────────────────────
router.post("/my-manager-goals", hasPermission("manage_own_goals"), myGoalController.getMyManagerGoals);

// ─────────────────────────────────────────────
// 🔹 Propagate Goals to Quarter
// ─────────────────────────────────────────────
router.post(
  "/propagate",
  hasPermission("manage_own_goals"),
  myGoalController.propagateGoalsToQuarter,
);

// ─────────────────────────────────────────────
// 🔹 Get Quarterly Goals
// ─────────────────────────────────────────────
router.get(
  "/quarterly",
  hasPermission("manage_own_goals"),
  myGoalController.getQuarterlyGoals,
);

// ─────────────────────────────────────────────
// 🔹 Check Admin Modifications
// ─────────────────────────────────────────────
router.get(
  "/admin-modifications",
  hasPermission("manage_own_goals"),
  myGoalController.checkAdminModifications,
);

// ─────────────────────────────────────────────
// 🔹 Admin Update Goal for Quarter
// ─────────────────────────────────────────────
router.put(
  "/admin-update/:goalId",
  hasPermission("manage_team_goals"),
  myGoalController.adminUpdateGoalForQuarter,
);

// ─────────────────────────────────────────────
// 🔹 Submit Goals (FINAL LOCK)
// ─────────────────────────────────────────────
router.post(
  "/submit",
  hasPermission("manage_own_goals"),
  myGoalController.submitGoals,
);

// ─────────────────────────────────────────────
// 🔹 Update Goal (target, weightage, uom)
// ─────────────────────────────────────────────
router.put(
  "/:goalId",
  hasPermission("manage_own_goals"),
  myGoalController.updateGoal,
);

// ─────────────────────────────────────────────
// 🔹 Delete Goal
// ─────────────────────────────────────────────
router.delete(
  "/:goalId",
  hasPermission("manage_own_goals"),
  myGoalController.deleteGoal,
);

// ─────────────────────────────────────────────
// 🔹 Add Comment
// ─────────────────────────────────────────────
router.post(
  "/:goalId/comment",
  hasPermission("manage_own_goals"),
  myGoalController.addComment,
);

export default router;
