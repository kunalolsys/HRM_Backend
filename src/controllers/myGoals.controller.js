import * as myGoalsService from "../services/myGoals.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const createMyGoals = asyncHandler(async (req, res) => {
  const data = await myGoalsService.createMyGoals(
    req.body,
    req.user._id,
    req.body.timelineId,
  );
  res.status(201).json({
    success: true,
    data,
  });
});

export const getMyGoals = asyncHandler(async (req, res) => {
  const data = await myGoalsService.getMyGoals(
    req.user._id,
    req.params.timelineId,
  );
  res.status(200).json({
    success: true,
    data: data || null,
  });
});

export const updateMyGoals = asyncHandler(async (req, res) => {
  const data = await myGoalsService.updateMyGoals(
    req.params.id,
    req.body,
    req.user._id,
  );
  res.status(200).json({
    success: true,
    data,
  });
});

export const submitMyGoals = asyncHandler(async (req, res) => {
  const data = await myGoalsService.submitMyGoals(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    data,
  });
});

export const getTeamGoals = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const data = await myGoalsService.getTeamGoals(
    req.user._id,
    req.params.timelineId,
    parseInt(page),
    parseInt(limit),
  );
  res.status(200).json({
    success: true,
    ...data,
  });
});

export const approveTeamGoal = asyncHandler(async (req, res) => {
  const data = await myGoalsService.approveTeamGoal(
    req.params.id,
    req.user._id,
  );
  res.status(200).json({
    success: true,
    data,
  });
});

export const deleteMyGoals = asyncHandler(async (req, res) => {
  await myGoalsService.deleteMyGoals(req.params.id, req.user._id);
  res.status(200).json({
    success: true,
    message: "Deleted successfully",
  });
});
