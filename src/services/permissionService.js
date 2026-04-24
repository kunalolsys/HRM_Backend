import Permission from "../models/Permission.js";

export const getAllPermissions = async () => {
  return await Permission.find().sort({ module: 1, name: 1 });
};

export const getPermissionById = async (id) => {
  const permission = await Permission.findById(id);
  if (!permission) throw new Error("Permission not found");
  return permission;
};

export const createPermission = async (permissionData) => {
  const existing = await Permission.findOne({ name: permissionData.name });
  if (existing) throw new Error("Permission with this name already exists");

  return await Permission.create(permissionData);
};

export const updatePermission = async (id, updateData) => {
  const permission = await Permission.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!permission) throw new Error("Permission not found");
  return permission;
};

export const deletePermission = async (id) => {
  const permission = await Permission.findByIdAndDelete(id);
  if (!permission) throw new Error("Permission not found");
  return permission;
};
