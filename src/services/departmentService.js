import Department from "../models/Department.js";

// ─── Get All Companies ─────────────────────────────────────────
export const getAllDepartment = async () => {
  return await Department.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();
};

// ─── Get Department By ID ─────────────────────────────────────────
export const getDepartmentById = async (id) => {
  const department = await Department.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!department) throw new Error("Department not found");

  return department;
};

// ─── Create Department ────────────────────────────────────────────
export const createDepartment = async (data) => {
  const existing = await Department.findOne({
    depCode: data.depCode,
    departmentName: data.departmentName,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Department with this code & name already exists");
  }

  const department = await Department.create(data);
  return department;
};

// ─── Update Department ────────────────────────────────────────────
export const updateDepartment = async (id, updateData) => {
  const department = await Department.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!department) throw new Error("Department not found");

  return department;
};

// ─── Soft Delete Department ───────────────────────────────────────
export const deleteDepartment = async (id, userId) => {
  const department = await Department.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!department) throw new Error("Department not found");

  return department;
};
