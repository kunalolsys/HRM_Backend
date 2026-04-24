import Role from "../models/Role.js";

export const getAllRoles = async () => {
  return await Role.find().populate("permissions", "name description module").sort({ createdAt: -1 });
};

export const getRoleById = async (id) => {
  const role = await Role.findById(id).populate("permissions", "name description module");
  if (!role) throw new Error("Role not found");
  return role;
};

export const createRole = async (roleData) => {
  const existing = await Role.findOne({ name: roleData.name });
  if (existing) throw new Error("Role with this name already exists");

  const role = await Role.create(roleData);
  return await role.populate("permissions");
};

export const updateRole = async (id, updateData) => {
  const role = await Role.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).populate("permissions", "name description module");

  if (!role) throw new Error("Role not found");
  return role;
};

export const deleteRole = async (id) => {
  const role = await Role.findByIdAndDelete(id);
  if (!role) throw new Error("Role not found");
  return role;
};

export const assignPermissionsToRole = async (roleId, permissionIds) => {
  const role = await Role.findByIdAndUpdate(
    roleId,
    { $set: { permissions: permissionIds } },
    { new: true }
  ).populate("permissions", "name description module");

  if (!role) throw new Error("Role not found");
  return role;
};
