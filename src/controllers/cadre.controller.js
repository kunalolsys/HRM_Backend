import { asyncHandler } from "../utils/asyncHandler.js";
import * as cadreService from "../services/cadre.service.js";

export const getAllCadre = asyncHandler(async (req, res) => {
  try {
    const data = await cadreService.getAllCadre(req.body);
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

export const getCadreById = asyncHandler(async (req, res) => {
  try {
    const data = await cadreService.getCadreById(req.params.id);
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

export const createCadre = asyncHandler(async (req, res) => {
  try {
    const data = await cadreService.createCadre(req.body);
    res.status(201).json({
      success: true,
      message: "Cadre created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateCadre = asyncHandler(async (req, res) => {
  try {
    const data = await cadreService.updateCadre(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Cadre updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteCadre = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await cadreService.deleteCadre(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Cadre deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
