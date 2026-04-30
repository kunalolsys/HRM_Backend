import { asyncHandler } from "../utils/asyncHandler.js";
import * as gradeService from "../services/grade.service.js";

export const getAllGrade = asyncHandler(async (req, res) => {
  try {
    const data = await gradeService.getAllGrade(req.body);
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
export const getAllGradeForDrops = asyncHandler(async (req, res) => {
  try {
    const data = await gradeService.getDropdownData(req.body);
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
export const getGradeById = asyncHandler(async (req, res) => {
  try {
    const data = await gradeService.getGradeById(req.params.id);
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

export const createGrade = asyncHandler(async (req, res) => {
  try {
    const data = await gradeService.createGrade(req.body);
    res.status(201).json({
      success: true,
      message: "Grade created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateGrade = asyncHandler(async (req, res) => {
  try {
    const data = await gradeService.updateGrade(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Grade updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteGrade = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await gradeService.deleteGrade(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Grade deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
