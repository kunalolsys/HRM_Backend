import { asyncHandler } from "../utils/asyncHandler.js";
import * as permissionService from "../services/permissionService.js";

export const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await permissionService.getAllPermissions();
  res.status(200).json({
    success: true,
    count: permissions.length,
    data: permissions,
  });
});

export const getPermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.getPermissionById(req.params.id);
  res.status(200).json({
    success: true,
    data: permission,
  });
});

export const createPermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.createPermission(req.body);
  res.status(201).json({
    success: true,
    message: "Permission created successfully",
    data: permission,
  });
});

export const updatePermission = asyncHandler(async (req, res) => {
  const permission = await permissionService.updatePermission(req.params.id, req.body);
  res.status(200).json({
    success: true,
    message: "Permission updated successfully",
    data: permission,
  });
});

export const deletePermission = asyncHandler(async (req, res) => {
  await permissionService.deletePermission(req.params.id);
  res.status(200).json({
    success: true,
    message: "Permission deleted successfully",
  });
});
