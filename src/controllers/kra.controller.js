import { asyncHandler } from "../utils/asyncHandler.js";
import * as kraService from "../services/kra.service.js";

export const getAllKRA = asyncHandler(async (req, res) => {
  try {
    const data = await kraService.getAllKRA(req.body);
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

export const getKRAById = asyncHandler(async (req, res) => {
  try {
    const data = await kraService.getKRAById(req.params.id);
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

export const createKRA = asyncHandler(async (req, res) => {
  try {
    const data = await kraService.createKRA(req.body);
    res.status(201).json({
      success: true,
      message: "KRA created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateKRA = asyncHandler(async (req, res) => {
  try {
    const data = await kraService.updateKRA(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "KRA updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteKRA = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await kraService.deleteKRA(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "KRA deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
