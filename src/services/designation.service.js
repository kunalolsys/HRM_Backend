import Cadre from "../models/Cadre.js";
import Designation from "../models/Designation.js";
import Grade from "../models/Grade.js";

// ─── Get All Designation ─────────────────────────────────────────
export const getAllDesignation = async (body) => {
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
    filter.$or = [{ name: { $regex: body.search, $options: "i" } }];
  }
  if (body.status) {
    filter.status = body.status;
  }
  if (body.grade) {
    filter.grade = body.grade;
  }

  const [data, total] = await Promise.all([
    Designation.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Designation.countDocuments(filter),
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
  const data = await Designation.find(filter)
    .select("_id name") // 🔥 only required fields
    .sort({ name: 1 })
    .lean();

  return data;
};
// ─── Get Designation By ID ─────────────────────────────────────────
export const getDesignationById = async (id) => {
  const designation = await Designation.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!designation) throw new Error("Designation not found");

  return designation;
};

// ─── Create Designation ────────────────────────────────────────────
export const createDesignation = async (data) => {
  // ─── Fetch Grade + Cadre ───────────────────
  const grade = await Grade.findOne({
    _id: data.grade,
    isDeleted: false,
  });

  if (!grade) {
    throw new Error("Invalid grade selected");
  }

  // ─── Duplicate check (better logic) ────────
  const existing = await Designation.findOne({
    name: data.name,
    grade: data.grade,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Designation already exists in this grade");
  }

  // ─── Create (auto-map cadre) ───────────────
  const designation = await Designation.create({
    name: data.name,
    grade: data.grade,
    cadre: grade.cadre, // 🔥 auto-mapped cadre
    status: data.status || "Active",
  });

  return await designation.populate([
    { path: "grade", select: "gradeCode" },
    { path: "cadre", select: "cadreName" },
  ]);
};
// ─── Update Designation ────────────────────────────────────────────
export const updateDesignation = async (id, updateData) => {
  // ─── Check existing designation ───────────────
  const existingDesignation = await Designation.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!existingDesignation) {
    throw new Error("Designation not found");
  }

  // ─── If grade is being updated ────────────────
  let grade = null;

  if (updateData.grade) {
    grade = await Grade.findOne({
      _id: updateData.grade,
      isDeleted: false,
    });

    if (!grade) {
      throw new Error("Grade not found");
    }
  }

  // ─── Duplicate check ─────────────────────────
  if (updateData.name || updateData.grade) {
    const duplicate = await Designation.findOne({
      name: updateData.name || existingDesignation.name,
      grade: updateData.grade || existingDesignation.grade,
      isDeleted: false,
      _id: { $ne: id }, // exclude current
    });

    if (duplicate) {
      throw new Error("Designation already exists in this grade");
    }
  }

  // ─── Auto-map cadre (VERY IMPORTANT) ─────────
  if (grade) {
    updateData.cadre = grade.cadre;
  }

  // Prevent manual override
  if (updateData.cadre) {
    delete updateData.cadre;
    if (grade) updateData.cadre = grade.cadre;
  }

  // ─── Update ─────────────────────────────────
  const updatedDesignation = await Designation.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  ).populate([
    { path: "grade", select: "gradeCode" },
    { path: "cadre", select: "cadreName" },
  ]);

  return updatedDesignation;
};

// ─── Soft Delete Designation ───────────────────────────────────────
export const deleteDesignation = async (id, userId) => {
  const designation = await Designation.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!designation) throw new Error("Designation not found");

  return designation;
};
