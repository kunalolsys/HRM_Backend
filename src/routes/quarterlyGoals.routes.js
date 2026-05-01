import express from "express";
import * as quarterlyGoalController from "../controllers/quarterlyGoals.controller.js";
import { authenticate, hasPermission } from "../middlewares/auth.js";

const router = express.Router();

// 🔐 All routes require auth
router.use(authenticate);

// ─────────────────────────────────────────────
// 🔹 Get Quarterly Goals (specific quarter)
// ─────────────────────────────────────────────
router.get(
  "/",
  hasPermission("manage_own_goals"),
  quarterlyGoalController.getQuarterlyGoals
);

// ─────────────────────────────────────────────
// 🔹 Get All Quarterly Goals (all quarters)
// ─────────────────────────────────────────────
router.get(
  "/all",
  hasPermission("manage_own_goals"),
  quarterlyGoalController.getAllQuarterlyGoals
);

// ─────────────────────────────────────────────
// 🔹 Update Quarterly Goal (target, weightage, uom)
// ─────────────────────────────────────────────
router.put(
  "/:goalId",
  hasPermission("manage_own_goals"),
  quarterlyGoalController.updateQuarterlyGoal
);

// ─────────────────────────────────────────────
// 🔹 Add Comment to Quarterly Goal
// ─────────────────────────────────────────────
router.post(
  "/:goalId/comment",
  hasPermission("manage_own_goals"),
  quarterlyGoalController.addCommentToQuarterlyGoal
);

// ─────────────────────────────────────────────
// 🔹 Delete Quarterly Goal Item
// ─────────────────────────────────────────────
router.delete(
  "/:goalId",
  hasPermission("manage_own_goals"),
  quarterlyGoalController.deleteQuarterlyGoal
);

// ─────────────────────────────────────────────
// MANAGER ROUTES
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 🔹 Manager: Get Team Quarterly Goals
// ─────────────────────────────────────────────
router.post(
  "/team/list",
  hasPermission("approve_team_goals"),
  quarterlyGoalController.getTeamQuarterlyGoals
);

// ─────────────────────────────────────────────
// 🔹 Manager: Approve Quarterly Goals
// ─────────────────────────────────────────────
router.post(
  "/team/approve",
  hasPermission("approve_team_goals"),
  quarterlyGoalController.approveQuarterlyGoals
);

// ─────────────────────────────────────────────
// 🔹 Manager: Add Remark to Quarterly Goal
// ─────────────────────────────────────────────
router.post(
  "/team/remark",
  hasPermission("approve_team_goals"),
  quarterlyGoalController.addRemarkToQuarterlyGoal
);

// ─────────────────────────────────────────────
// ADMIN ROUTES
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// 🔹 Admin: Update Quarterly Goal (any user)
// ─────────────────────────────────────────────
router.put(
  "/admin/:quarterlyGoalId/:goalId",
  hasPermission("manage_team_goals"),
  quarterlyGoalController.adminUpdateQuarterlyGoal
);

export default router;
