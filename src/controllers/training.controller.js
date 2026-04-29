import { asyncHandler } from "../utils/asyncHandler.js";
import * as trainingService from "../services/training.service.js";

export const getAllTraining = asyncHandler(async (req, res) => {
  try {
    const data = await trainingService.getAllTraining(req.body);
    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const getTrainingById = asyncHandler(async (req, res) => {
  try {
    const data = await trainingService.getTrainingById(req.params.id);
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

export const createTraining = asyncHandler(async (req, res) => {
  try {
    const data = await trainingService.createTraining(req.body);
    res.status(201).json({
      success: true,
      message: "Training created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateTraining = asyncHandler(async (req, res) => {
  try {
    const data = await trainingService.updateTraining(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Training updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteTraining = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    await trainingService.deleteTraining(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Training deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
