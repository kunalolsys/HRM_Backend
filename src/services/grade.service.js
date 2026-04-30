import Cadre from "../models/Cadre.js";
import Grade from "../models/Grade.js";

// ─── Get All Grade ─────────────────────────────────────────
export const getAllGrade = async (body) => {
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
    filter.$or = [{ gradeCode: { $regex: body.search, $options: "i" } }];
  }
  if (body.status) {
    filter.status = body.status;
  }
  if (body.cadre) {
    filter.cadre = body.cadre;
  }

  const [data, total] = await Promise.all([
    Grade.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Grade.countDocuments(filter),
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
  const data = await Grade.find(filter)
    .select("_id gradeCode") // 🔥 only required fields
    .sort({ gradeCode: 1 })
    .lean();

  return data;
};
// ─── Get Grade By ID ─────────────────────────────────────────
export const getGradeById = async (id) => {
  const grade = await Grade.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!grade) throw new Error("Grade not found");

  return grade;
};

// ─── Create Grade ────────────────────────────────────────────
export const createGrade = async (data) => {
  const cadre = await Cadre.findOne({
    _id: data.cadre,
    isDeleted: false,
  });

  if (!cadre) {
    throw new Error("Invalid cadre selected");
  }

  const existing = await Grade.findOne({
    gradeCode: data.gradeCode,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Grade with this code already exists");
  }

  const grade = await Grade.create(data);
  return await grade.populate("cadre", "cadreName");
};

// ─── Update Grade ────────────────────────────────────────────
export const updateGrade = async (id, updateData) => {
  const existingGrade = await Grade.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!existingGrade) {
    throw new Error("Grade not found");
  }
  // ─── Validate Cadre (if updating) ─────────────
  if (updateData.cadre) {
    if (!mongoose.Types.ObjectId.isValid(updateData.cadre)) {
      throw new Error("Invalid cadre ID");
    }

    const cadre = await Cadre.findOne({
      _id: updateData.cadre,
      isDeleted: false,
    });

    if (!cadre) {
      throw new Error("Cadre not found");
    }
  }
  // ─── Duplicate Check ─────────────────────────
  if (updateData.gradeCode || updateData.cadre) {
    const duplicate = await Grade.findOne({
      gradeCode: updateData.gradeCode || existingGrade.gradeCode,
      cadre: updateData.cadre || existingGrade.cadre,
      isDeleted: false,
      _id: { $ne: id }, // exclude current
    });

    if (duplicate) {
      throw new Error("Grade already exists in this cadre");
    }
  }

  // ─── Update ──────────────────────────────────
  const updatedGrade = await Grade.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  ).populate("cadre", "cadreName");

  return updatedGrade;
};

// ─── Soft Delete Grade ───────────────────────────────────────
export const deleteGrade = async (id, userId) => {
  const grade = await Grade.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!grade) throw new Error("Grade not found");

  return grade;
};
