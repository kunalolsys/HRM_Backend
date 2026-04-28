import { asyncHandler } from "../utils/asyncHandler.js";
import * as uomService from "../services/uomService.js";

export const getAllUOM = asyncHandler(async (req, res) => {
  try {
    const data = await uomService.getAllUOM(req.body);
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

export const getUOMById = asyncHandler(async (req, res) => {
  try {
    const data = await uomService.getUOMById(req.params.id);
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

export const createUOM = asyncHandler(async (req, res) => {
  try {
    const data = await uomService.createUOM(req.body);
    res.status(201).json({
      success: true,
      message: "UOM created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateUOM = asyncHandler(async (req, res) => {
  try {
    const data = await uomService.updateUOM(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "UOM updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteUOM = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await uomService.deleteUOM(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "UOM deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
