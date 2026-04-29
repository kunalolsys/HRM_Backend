import express from "express";
import * as myGoalController from "../controllers/myGoals.controller.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// 🔐 All routes require auth
router.use(authenticate);

// ─────────────────────────────────────────────
// 🔹 Initialize My Goals (create once per year)
// ─────────────────────────────────────────────
router.post("/init", myGoalController.initMyGoals);

// ─────────────────────────────────────────────
// 🔹 Import from Global Goal Library
// ─────────────────────────────────────────────
router.post("/import", myGoalController.importFromLibrary);

// ─────────────────────────────────────────────
// 🔹 Cascade Manager Goals
// ─────────────────────────────────────────────
router.post("/cascade", myGoalController.cascadeManagerGoals);

// ─────────────────────────────────────────────
// 🔹 Get My Goals
// ─────────────────────────────────────────────
router.get("/", myGoalController.getMyGoals);

// ─────────────────────────────────────────────
// 🔹 Submit Goals (FINAL LOCK)
// ─────────────────────────────────────────────
router.post("/submit", myGoalController.submitGoals);

// ─────────────────────────────────────────────
// 🔹 Update Goal (target, weightage, uom)
// ─────────────────────────────────────────────
router.put("/:goalId", myGoalController.updateGoal);

// ─────────────────────────────────────────────
// 🔹 Delete Goal
// ─────────────────────────────────────────────
router.delete("/:goalId", myGoalController.deleteGoal);

// ─────────────────────────────────────────────
// 🔹 Add Comment
// ─────────────────────────────────────────────
router.post("/:goalId/comment", myGoalController.addComment);

export default router;
