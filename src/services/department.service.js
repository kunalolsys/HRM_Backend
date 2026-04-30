import Department from "../models/Department.js";

// ─── Get All Departments ─────────────────────────────────────────
export const getAllDepartment = async (body) => {
  const page = Math.max(parseInt(body.page) || 1, 1);
  const limit = Math.min(parseInt(body.limit) || 10, 100);
  const skip = (page - 1) * limit;
  const sortField = body.sortBy || "createdAt";
  const sortOrder = body.order === "asc" ? 1 : -1;
  const filter = {
    isDeleted: false,
  };

  // ─── Search ─────────────────────────────
  if (body.search) {
    filter.$or = [
      { departmentName: { $regex: body.search, $options: "i" } },
      { depCode: { $regex: body.search, $options: "i" } },
    ];
  }
  if (body.status) {
    filter.status = body.status;
  }

  const [data, total] = await Promise.all([
    Department.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Department.countDocuments(filter),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
//**Get dropdown Data */
export const getDropdownData = async () => {
  const filter = { isDeleted: false };
  const data = await Department.find(filter)
    .select("_id departmentName") // 🔥 only required fields
    .sort({ departmentName: 1 })
    .lean();

  return data;
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
    { returnDocument: "after", runValidators: true },
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
