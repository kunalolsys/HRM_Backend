import { asyncHandler } from "../utils/asyncHandler.js";
import * as myGoalService from "../services/myGoals.service.js";

// ─────────────────────────────────────────────
// 🔹 Initialize My Goals (create empty sheet)
// ─────────────────────────────────────────────
export const initMyGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const managerId = req.user.reportingManager;
    const { financialYear } = req.body;

    const data = await myGoalService.initMyGoals(
      userId,
      managerId,
      financialYear,
    );

    res.status(201).json({
      success: true,
      message: "MyGoals initialized",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Import from Global Goal Library
// ─────────────────────────────────────────────
export const importFromLibrary = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, libraryIds, goalType } = req.body;

    const data = await myGoalService.importFromLibrary(
      userId,
      financialYear,
      libraryIds,
      goalType,
    );

    res.status(200).json({
      success: true,
      message: "Goals imported from library",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Cascade Manager Goals
// ─────────────────────────────────────────────
export const cascadeManagerGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const managerId = req.user.reportingManager;

    const { financialYear, goalIds } = req.body;

    const data = await myGoalService.cascadeManagerGoals(
      userId,
      managerId,
      financialYear,
      goalIds,
    );

    res.status(200).json({
      success: true,
      message: "Manager goals cascaded",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Update Goal (target, weightage, uom)
// ─────────────────────────────────────────────
export const updateGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear } = req.body;
    const { goalId } = req.params;

    const data = await myGoalService.updateGoal(
      userId,
      financialYear,
      goalId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Goal updated",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Delete Goal
// ─────────────────────────────────────────────
export const deleteGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear } = req.body;
    const { goalId } = req.params;

    const data = await myGoalService.deleteGoal(userId, financialYear, goalId);

    res.status(200).json({
      success: true,
      message: "Goal deleted",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Add Comment
// ─────────────────────────────────────────────
export const addComment = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, text } = req.body;
    const { goalId } = req.params;

    const data = await myGoalService.addComment(
      userId,
      financialYear,
      goalId,
      text,
    );

    res.status(200).json({
      success: true,
      message: "Comment added",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Submit Goals (FINAL LOCK)
// ─────────────────────────────────────────────
export const submitGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear } = req.body;

    const data = await myGoalService.submitGoals(userId, financialYear);

    res.status(200).json({
      success: true,
      message: "Goals submitted successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Get My Goals
// ─────────────────────────────────────────────
export const getMyGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear } = req.query;

    const data = await myGoalService.getMyGoals(userId, financialYear);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
// ─────────────────────────────────────────────
// 🔹 Get My Manager Goals
// ─────────────────────────────────────────────
export const getMyManagerGoals = asyncHandler(async (req, res) => {
  try {
    const { managerId } = req.body;
    const { financialYear } = req.query;

    const data = await myGoalService.getMyManagerGoals(
      managerId,
      financialYear,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Propagate Goals to Quarter
// ─────────────────────────────────────────────
export const propagateGoalsToQuarter = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, quarter } = req.body;

    const data = await myGoalService.propagateGoalsToQuarter(
      userId,
      financialYear,
      quarter,
    );

    res.status(200).json({
      success: true,
      message: `Goals propagated to ${quarter}`,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Get Quarterly Goals
// ─────────────────────────────────────────────
export const getQuarterlyGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, quarter } = req.query;

    const data = await myGoalService.getQuarterlyGoals(
      userId,
      financialYear,
      quarter,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Check Admin Modifications
// ─────────────────────────────────────────────
export const checkAdminModifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, quarter } = req.query;

    const data = await myGoalService.checkAdminModifications(
      userId,
      financialYear,
      quarter,
    );

    res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Admin Update Goal for Specific Quarter
// ─────────────────────────────────────────────
export const adminUpdateGoalForQuarter = asyncHandler(async (req, res) => {
  try {
    const adminId = req.user._id;
    const { goalId } = req.params;

    const data = await myGoalService.adminUpdateGoalForQuarter(
      goalId,
      adminId,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Goal updated by admin",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
