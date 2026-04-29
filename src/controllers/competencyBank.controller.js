import { asyncHandler } from "../utils/asyncHandler.js";
import * as competencyService from "../services/competencyBank.service.js";

export const getAllCompetency = asyncHandler(async (req, res) => {
  try {
    const data = await competencyService.getAllCompetency(req.body);
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

export const getCompetencyById = asyncHandler(async (req, res) => {
  try {
    const data = await competencyService.getCompetencyById(req.params.id);
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

export const createCompetency = asyncHandler(async (req, res) => {
  try {
    const data = await competencyService.createCompetency(req.body);
    res.status(201).json({
      success: true,
      message: "Competency Bank created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateCompetency = asyncHandler(async (req, res) => {
  try {
    const data = await competencyService.updateCompetency(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Competency Bank updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteCompetency = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await competencyService.deleteCompetency(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Competency Bank deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
