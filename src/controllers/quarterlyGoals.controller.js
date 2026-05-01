import { asyncHandler } from "../utils/asyncHandler.js";
import * as quarterlyGoalService from "../services/quarterlyGoals.service.js";

// ─────────────────────────────────────────────
// 🔹 Get Quarterly Goals
// ─────────────────────────────────────────────
export const getQuarterlyGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, quarter } = req.query;

    const data = await quarterlyGoalService.getQuarterlyGoals(
      userId,
      financialYear,
      quarter
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
// 🔹 Get All Quarterly Goals for User
// ─────────────────────────────────────────────
export const getAllQuarterlyGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear } = req.query;

    const data = await quarterlyGoalService.getAllQuarterlyGoals(
      userId,
      financialYear
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
// 🔹 Update Quarterly Goal (target, weightage, uom)
// ─────────────────────────────────────────────
export const updateQuarterlyGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, quarter } = req.body;
    const { goalId } = req.params;

    const data = await quarterlyGoalService.updateQuarterlyGoal(
      userId,
      financialYear,
      quarter,
      goalId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Quarterly goal updated",
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
// 🔹 Add Comment to Quarterly Goal
// ─────────────────────────────────────────────
export const addCommentToQuarterlyGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, quarter, text } = req.body;
    const { goalId } = req.params;

    const data = await quarterlyGoalService.addCommentToQuarterlyGoal(
      userId,
      financialYear,
      quarter,
      goalId,
      text
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

// ───────────────────────────────────���─────────
// 🔹 Delete Quarterly Goal Item
// ─────────────────────────────────────────────
export const deleteQuarterlyGoal = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear, quarter } = req.body;
    const { goalId } = req.params;

    const data = await quarterlyGoalService.deleteQuarterlyGoal(
      userId,
      financialYear,
      quarter,
      goalId
    );

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
// 🔹 Manager: Get Team Quarterly Goals
// ─────────────────────────────────────────────
export const getTeamQuarterlyGoals = asyncHandler(async (req, res) => {
  try {
    const managerId = req.user._id;
    const { financialYear, quarter } = req.query;
    const { search } = req.body;

    const data = await quarterlyGoalService.getTeamQuarterlyGoals(
      managerId,
      financialYear,
      quarter,
      search
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
// 🔹 Manager: Approve Quarterly Goals
// ─────────────────────────────────────────────
export const approveQuarterlyGoals = asyncHandler(async (req, res) => {
  try {
    const managerId = req.user._id;
    const { quarterlyGoalId } = req.body;

    const data = await quarterlyGoalService.approveQuarterlyGoals(
      managerId,
      quarterlyGoalId
    );

    res.status(200).json({
      success: true,
      message: "Quarterly goals approved",
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
// 🔹 Manager: Add Remark to Quarterly Goal
// ─────────────────────────────────────────────
export const addRemarkToQuarterlyGoal = asyncHandler(async (req, res) => {
  try {
    const managerId = req.user._id;
    const { quarterlyGoalId, goalId, text } = req.body;

    const data = await quarterlyGoalService.addRemarkToQuarterlyGoal(
      managerId,
      quarterlyGoalId,
      goalId,
      text
    );

    res.status(200).json({
      success: true,
      message: "Remark added",
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
// 🔹 Admin: Update Quarterly Goal (any user)
// ─────────────────────────────────────────────
export const adminUpdateQuarterlyGoal = asyncHandler(async (req, res) => {
  try {
    const adminId = req.user._id;
    const { quarterlyGoalId, goalId } = req.params;

    const data = await quarterlyGoalService.adminUpdateQuarterlyGoal(
      quarterlyGoalId,
      goalId,
      adminId,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Quarterly goal updated by admin",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
