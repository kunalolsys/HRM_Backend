import { asyncHandler } from "../utils/asyncHandler.js";
import * as roleService from "../services/roleService.js";

export const getRoles = asyncHandler(async (req, res) => {
  try {
    const roles = await roleService.getAllRoles();
    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const getRole = asyncHandler(async (req, res) => {
  try {
    const role = await roleService.getRoleById(req.params.id);
    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const createRole = asyncHandler(async (req, res) => {
  try {
    const role = await roleService.createRole(req.body);
    res.status(201).json({
      success: true,
      message: "Role created successfully",
      data: role,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const updateRole = asyncHandler(async (req, res) => {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: role,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const deleteRole = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    await roleService.deleteRole(req.params.id, userId);
    res.status(200).json({
      success: true,
      message: "Role deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

export const assignPermissions = asyncHandler(async (req, res) => {
  try {
    const { permissionIds } = req.body;
    const role = await roleService.assignPermissionsToRole(
      req.params.id,
      permissionIds,
    );
    res.status(200).json({
      success: true,
      message: "Permissions assigned successfully",
      data: role,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
