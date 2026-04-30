import * as teamGoalService from "../services/teamGoals.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// ─────────────────────────────────────────────
// 🔹 Get Team Goals
// ─────────────────────────────────────────────
export const getTeamGoals = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { financialYear } = req.query;

    const data = await teamGoalService.getTeamGoals(
      userId,
      financialYear,
      req.body,
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
// 🔹 Manager Send Remark to perticular goal
// ─────────────────────────────────────────────
export const managerAddRemark = asyncHandler(async (req, res) => {
  try {
    const managerId = req.user._id;

    const data = await teamGoalService.managerAddRemark(managerId, req.body);

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
// 🔹 Send Back for Correction
// ─────────────────────────────────────────────
export const sendBackForEdit = asyncHandler(async (req, res) => {
  try {
    const managerId = req.user._id;
    const { myGoalId } = req.body;
    const data = await teamGoalService.sendBackForEdit(managerId, myGoalId);

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
// 🔹 Approve Goals
// ─────────────────────────────────────────────
export const approveGoals = asyncHandler(async (req, res) => {
  try {
    const managerId = req.user._id;
    const { myGoalId } = req.body;
    const data = await teamGoalService.approveGoals(managerId, myGoalId);

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
// 🔹 Review And SendBack
// ─────────────────────────────────────────────
export const reviewAndSendBack = asyncHandler(async (req, res) => {
  try {
    const managerId = req.user._id;
    const { myGoalId, remarks } = req.body;
    const data = await teamGoalService.reviewAndSendBack(
      managerId,
      myGoalId,
      remarks,
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
