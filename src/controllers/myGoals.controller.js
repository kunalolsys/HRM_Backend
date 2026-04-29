import { asyncHandler } from "../utils/asyncHandler.js";
import * as myGoalService from "../services/myGoals.service.js";

// ─────────────────────────────────────────────
// 🔹 Initialize My Goals (create empty sheet)
// ─────────────────────────────────────────────
export const initMyGoals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const managerId = req.user.reportingManager;
  const { financialYear } = req.body;

  const data = await myGoalService.initMyGoals(
    userId,
    managerId,
    financialYear
  );

  res.status(201).json({
    success: true,
    message: "MyGoals initialized",
    data,
  });
});

// ─────────────────────────────────────────────
// 🔹 Import from Global Goal Library
// ─────────────────────────────────────────────
export const importFromLibrary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { financialYear, libraryIds, goalType } = req.body;

  const data = await myGoalService.importFromLibrary(
    userId,
    financialYear,
    libraryIds,
    goalType
  );

  res.status(200).json({
    success: true,
    message: "Goals imported from library",
    data,
  });
});

// ─────────────────────────────────────────────
// 🔹 Cascade Manager Goals
// ─────────────────────────────────────────────
export const cascadeManagerGoals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const managerId = req.user.reportingManager;

  const { financialYear, goalIds } = req.body;

  const data = await myGoalService.cascadeManagerGoals(
    userId,
    managerId,
    financialYear,
    goalIds
  );

  res.status(200).json({
    success: true,
    message: "Manager goals cascaded",
    data,
  });
});

// ─────────────────────────────────────────────
// 🔹 Update Goal (target, weightage, uom)
// ─────────────────────────────────────────────
export const updateGoal = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { financialYear } = req.body;
  const { goalId } = req.params;

  const data = await myGoalService.updateGoal(
    userId,
    financialYear,
    goalId,
    req.body
  );

  res.status(200).json({
    success: true,
    message: "Goal updated",
    data,
  });
});

// ─────────────────────────────────────────────
// 🔹 Delete Goal
// ─────────────────────────────────────────────
export const deleteGoal = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { financialYear } = req.body;
  const { goalId } = req.params;

  const data = await myGoalService.deleteGoal(
    userId,
    financialYear,
    goalId
  );

  res.status(200).json({
    success: true,
    message: "Goal deleted",
    data,
  });
});

// ─────────────────────────────────────────────
// 🔹 Add Comment
// ─────────────────────────────────────────────
export const addComment = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { financialYear, text } = req.body;
  const { goalId } = req.params;

  const data = await myGoalService.addComment(
    userId,
    financialYear,
    goalId,
    text
  );

  res.status(200).json({
    success: true,
    message: "Comment added",
    data,
  });
});

// ─────────────────────────────────────────────
// 🔹 Submit Goals (FINAL LOCK)
// ─────────────────────────────────────────────
export const submitGoals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { financialYear } = req.body;

  const data = await myGoalService.submitGoals(
    userId,
    financialYear
  );

  res.status(200).json({
    success: true,
    message: "Goals submitted successfully",
    data,
  });
});

// ─────────────────────────────────────────────
// 🔹 Get My Goals
// ─────────────────────────────────────────────
export const getMyGoals = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { financialYear } = req.query;

  const data = await myGoalService.getMyGoals(
    userId,
    financialYear
  );

  res.status(200).json({
    success: true,
    data,
  });
});