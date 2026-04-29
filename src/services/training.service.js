import Training from "../models/Training.js";

// ─── Get All Trainings ─────────────────────────────────────────
export const getAllTraining = async (body) => {
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
      { categoryName: { $regex: body.search, $options: "i" } },
      { "subcategories.name": { $regex: body.search, $options: "i" } },
    ];
  }
  if (body.status) {
    filter.status = body.status;
  }
  const [data, total] = await Promise.all([
    Training.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Training.countDocuments(filter),
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

// ─── Get Training By ID ─────────────────────────────────────────
export const getTrainingById = async (id) => {
  const training = await Training.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!training) throw new Error("Training not found");

  return training;
};

// ─── Create Training ────────────────────────────────────────────
export const createTraining = async (data) => {
  if (!data.categoryName) {
    throw new Error("Category name is required");
  }
  // ─── Check duplicate (within same company) ────────
  const existing = await Training.findOne({
    categoryName: data.categoryName,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Training with this category already exists.");
  }
  // Validate subcategories
  if (data.subcategories?.length) {
    const names = data.subcategories.map((s) => s.name.toLowerCase().trim());

    const unique = new Set(names);

    if (names.length !== unique.size) {
      throw new Error("Duplicate subcategories are not allowed");
    }
  }

  return await Training.create(data);
};

// ─── Update Training ────────────────────────────────────────────
export const updateTraining = async (id, updateData) => {
  const existing = await Training.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!existing) {
    throw new Error("Training not found");
  }

  // Prevent duplicate category name
  if (updateData.categoryName) {
    const duplicate = await Training.findOne({
      categoryName: updateData.categoryName,
      _id: { $ne: id },
      isDeleted: false,
    });

    if (duplicate) {
      throw new Error("Category name already exists");
    }
  }

  // Validate subcategories
  if (updateData.subcategories?.length) {
    const names = updateData.subcategories.map((s) =>
      s.name.toLowerCase().trim(),
    );

    const unique = new Set(names);

    if (names.length !== unique.size) {
      throw new Error("Duplicate subcategories are not allowed");
    }
  }

  const updated = await Training.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  return updated;
};

// ─── Soft Delete Training ───────────────────────────────────────
export const deleteTraining = async (id, userId) => {
  const training = await Training.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
    },
    { returnDocument: "after" }, // ✅ fix mongoose warning
  );

  if (!training) throw new Error("Training not found");

  return training;
};
