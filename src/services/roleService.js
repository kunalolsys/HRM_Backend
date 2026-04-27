import Role from "../models/Role.js";

export const getAllRoles = async () => {
  return await Role.find({ isDeleted: false })
    .populate("permissions", "name description module")
    .sort({ createdAt: -1 });
};

export const getRoleById = async (id) => {
  const role = await Role.findById({
    _id: id,
    isDeleted: false,
  }).populate("permissions", "name description module");
  if (!role) throw new Error("Role not found");
  return role;
};

export const createRole = async (roleData) => {
  const existing = await Role.findOne({
    name: roleData.name,
    isDeleted: false,
  });
  if (existing) throw new Error("Role with this name already exists");

  const role = await Role.create(roleData);
  return await role.populate("permissions");
};

export const updateRole = async (id, updateData) => {
  const role = await Role.findByIdAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  ).populate("permissions", "name description module");

  if (!role) throw new Error("Role not found");
  return role;
};

export const deleteRole = async (id, userId) => {
  const role = await Role.findByIdAndDelete(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );
  if (!role) throw new Error("Role not found");
  return role;
};

export const assignPermissionsToRole = async (roleId, permissionIds) => {
  const role = await Role.findByIdAndUpdate(
    roleId,
    { $set: { permissions: permissionIds } },
    { new: true },
  ).populate("permissions", "name description module");

  if (!role) throw new Error("Role not found");
  return role;
};
