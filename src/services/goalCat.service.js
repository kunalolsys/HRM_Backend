import GoalCategory from "../models/GoalCat.js";

// ─── Get All Goal category ─────────────────────────────────────────
export const getAllGoalCategory = async (body) => {
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
  const [data, total] = await Promise.all([
    GoalCategory.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    GoalCategory.countDocuments(filter),
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
  const data = await GoalCategory.find(filter)
    .select("_id name") // 🔥 only required fields
    .sort({ name: 1 })
    .lean();

  return data;
};
// ─── Get Goal category By ID ─────────────────────────────────────────
export const getGoalCategoryById = async (id) => {
  const category = await GoalCategory.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!category) throw new Error("Goal category not found");

  return category;
};

// ─── Create Goal category ────────────────────────────────────────────
export const createGoalCategory = async (data) => {
  const existing = await GoalCategory.findOne({
    name: data.name,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Goal category with this name already exists");
  }

  const category = await GoalCategory.create(data);
  return category;
};

// ─── Update Goal Category ────────────────────────────────────────────
export const updateGoalCategory = async (id, updateData) => {
  const category = await GoalCategory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  );

  if (!category) throw new Error("Goal category not found");

  return category;
};

// ─── Soft Delete Goal Category ───────────────────────────────────────
export const deleteGoalCategory = async (id, userId) => {
  const category = await GoalCategory.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!category) throw new Error("Goal category not found");

  return category;
};
