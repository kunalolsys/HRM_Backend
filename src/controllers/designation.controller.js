import { asyncHandler } from "../utils/asyncHandler.js";
import * as designationService from "../services/designation.service.js";

export const getAllDesignation = asyncHandler(async (req, res) => {
  try {
    const data = await designationService.getAllDesignation(req.body);
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
export const getAllDesignationForDrops = asyncHandler(async (req, res) => {
  try {
    const data = await designationService.getDropdownData(req.body);
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
export const getDesignationById = asyncHandler(async (req, res) => {
  try {
    const data = await designationService.getDesignationById(req.params.id);
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

export const createDesignation = asyncHandler(async (req, res) => {
  try {
    const data = await designationService.createDesignation(req.body);
    res.status(201).json({
      success: true,
      message: "Designation created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateDesignation = asyncHandler(async (req, res) => {
  try {
    const data = await designationService.updateDesignation(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Designation updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteDesignation = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await designationService.deleteDesignation(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Designation deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
