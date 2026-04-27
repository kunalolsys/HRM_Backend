import Permission from "../models/Permission.js";

export const getAllPermissions = async () => {
  return await Permission.find({ isDeleted: false }).sort({
    module: 1,
    name: 1,
  });
};

export const getPermissionById = async (id) => {
  const permission = await Permission.findById({
    _id: id,
    isDeleted: false,
  });
  if (!permission) throw new Error("Permission not found");
  return permission;
};

export const createPermission = async (permissionData) => {
  const existing = await Permission.findOne({
    name: permissionData.name,
    isDeleted: false,
  });
  if (existing) throw new Error("Permission with this name already exists");

  return await Permission.create(permissionData);
};

export const updatePermission = async (id, updateData) => {
  const permission = await Permission.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!permission) throw new Error("Permission not found");
  return permission;
};

export const deletePermission = async (id, userId) => {
  const permission = await Permission.findByIdAndDelete(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );
  if (!permission) throw new Error("Permission not found");
  return permission;
};
