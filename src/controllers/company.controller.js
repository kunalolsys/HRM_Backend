import { asyncHandler } from "../utils/asyncHandler.js";
import * as companyService from "../services/company.service.js";

export const getAllComp = asyncHandler(async (req, res) => {
  try {
    const data = await companyService.getAllCompany(req.body);
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
export const getAllCompForDrops = asyncHandler(async (req, res) => {
  try {
    const data = await companyService.getDropdownData(req.body);
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
export const getCompById = asyncHandler(async (req, res) => {
  try {
    const data = await companyService.getCompanyById(req.params.id);
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

export const createComp = asyncHandler(async (req, res) => {
  try {
    const data = await companyService.createCompany(req.body);
    res.status(201).json({
      success: true,
      message: "Company created successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateComp = asyncHandler(async (req, res) => {
  try {
    const data = await companyService.updateCompany(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Company updated successfully",
      data: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteComp = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    await companyService.deleteCompany(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Company deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
