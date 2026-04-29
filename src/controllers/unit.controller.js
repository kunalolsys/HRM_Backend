import { asyncHandler } from "../utils/asyncHandler.js";
import * as unitService from "../services/unit.service.js";

export const getUnit = asyncHandler(async (req, res) => {
  try {
    const data = await unitService.getAllUnits(req.body);
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

export const getUnitById = asyncHandler(async (req, res) => {
  try {
    const data = await unitService.getUnitById(req.params.id);
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

export const createUnit = asyncHandler(async (req, res) => {
  try {
    const data = await unitService.createUnit(req.body);
    res.status(201).json({
      success: true,
      message: "Unit created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateUnit = asyncHandler(async (req, res) => {
  try {
    const data = await unitService.updateUnit(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Unit updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteUnit = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    await unitService.deleteUnit(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Unit deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
