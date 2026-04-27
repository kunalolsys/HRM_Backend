import { asyncHandler } from "../utils/asyncHandler.js";
import * as departmentService from "../services/departmentService.js";

export const getAllDep = asyncHandler(async (req, res) => {
  try {
    const data = await departmentService.getAllDepartment(req.body);
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

export const getDepById = asyncHandler(async (req, res) => {
  try {
    const data = await departmentService.getDepartmentById(req.params.id);
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

export const createDep = asyncHandler(async (req, res) => {
  try {
    const data = await departmentService.createDepartment(req.body);
    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateDep = asyncHandler(async (req, res) => {
  try {
    const data = await departmentService.updateDepartment(
      req.params.id,
      req.body,
    );
    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteDep = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await departmentService.deleteDepartment(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
