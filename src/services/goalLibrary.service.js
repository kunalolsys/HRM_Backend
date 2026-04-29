import GlobalGoalLibrary from "../models/GoalLibrary.js";

export const createGoalLibrary = async (data) => {
  if (!data.combinations || data.combinations.length === 0) {
    throw new Error("At least one combination is required");
  }

  if (!data.kras || data.kras.length === 0) {
    throw new Error("At least one KRA is required");
  }

  const totalKpis = data.kras.reduce(
    (acc, k) => acc + (k.kpis?.length || 0),
    0,
  );

  if (data.goalType === "ROUTINE" && totalKpis < 3) {
    throw new Error("Minimum 3 KPIs required for Routine goals");
  }

  if (data.goalType === "SPECIAL" && totalKpis < 1) {
    throw new Error("Minimum 1 KPI required for Special goals");
  }

  const doc = await GlobalGoalLibrary.create(data);

  return await doc.populate([
    { path: "combinations.department", select: "departmentName" },
    { path: "combinations.grade", select: "gradeCode" },
    { path: "combinations.designation", select: "name" },
    { path: "kras.kra", select: "name" },
    { path: "kras.category", select: "name" },
  ]);
};

export const getAllGoalLibrary = async (body) => {
  const page = Math.max(parseInt(body.page) || 1, 1);
  const limit = Math.min(parseInt(body.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const filter = { isDeleted: false };

  const [data, total] = await Promise.all([
    GlobalGoalLibrary.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),

    GlobalGoalLibrary.countDocuments(filter),
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

export const getGoalLibraryById = async (id) => {
  const doc = await GlobalGoalLibrary.findOne({
    _id: id,
    isDeleted: false,
  }).populate([
    { path: "combinations.department", select: "departmentName" },
    { path: "combinations.grade", select: "gradeCode" },
    { path: "combinations.designation", select: "name" },
    { path: "kras.kra", select: "name" },
    { path: "kras.category", select: "name" },
  ]);

  if (!doc) throw new Error("Goal library not found");

  return doc;
};

export const updateGoalLibrary = async (id, data) => {
  const existing = await GlobalGoalLibrary.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!existing) throw new Error("Goal library not found");

  // same validation as create
  if (!data.combinations || data.combinations.length === 0) {
    throw new Error("At least one combination is required");
  }

  if (!data.kras || data.kras.length === 0) {
    throw new Error("At least one KRA is required");
  }

  const totalKpis = data.kras.reduce(
    (acc, k) => acc + (k.kpis?.length || 0),
    0,
  );

  if (data.goalType === "ROUTINE" && totalKpis < 3) {
    throw new Error("Minimum 3 KPIs required for Routine goals");
  }

  if (data.goalType === "SPECIAL" && totalKpis < 1) {
    throw new Error("Minimum 1 KPI required for Special goals");
  }

  const updated = await GlobalGoalLibrary.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    {
      returnDocument: "after", // ✅ fix mongoose warning
      runValidators: true,
    },
  );

  return updated;
};

export const deleteGoalLibrary = async (id, userId) => {
  const doc = await GlobalGoalLibrary.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId,
    },
    { returnDocument: "after" },
  );

  if (!doc) throw new Error("Goal library not found");

  return doc;
};
