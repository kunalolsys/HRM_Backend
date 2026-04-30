import { asyncHandler } from "../utils/asyncHandler.js";
import * as goalCatService from "../services/goalCat.service.js";

export const getAllGoalCat = asyncHandler(async (req, res) => {
  try {
    const data = await goalCatService.getAllGoalCategory(req.body);
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
export const getAllGoalCatForDrops = asyncHandler(async (req, res) => {
  try {
    const data = await goalCatService.getDropdownData(req.body);
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
export const getGoalCatById = asyncHandler(async (req, res) => {
  try {
    const data = await goalCatService.getGoalCategoryById(req.params.id);
    res.status(200).json({
      success: true,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const createGoalCat = asyncHandler(async (req, res) => {
  try {
    const data = await goalCatService.createGoalCategory(req.body);
    res.status(201).json({
      success: true,
      message: "Goal category created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateGoalCat = asyncHandler(async (req, res) => {
  try {
    const data = await goalCatService.updateGoalCategory(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Goal category updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteGoalCat = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await goalCatService.deleteGoalCategory(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Goal category deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
