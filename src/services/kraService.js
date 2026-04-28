import KRA from "../models/KRA.js";

// ─── Get All KRA ─────────────────────────────────────────
export const getAllKRA = async (body) => {
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
    KRA.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    KRA.countDocuments(filter),
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

// ─── Get KRA By ID ─────────────────────────────────────────
export const getKRAById = async (id) => {
  const kra = await KRA.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!kra) throw new Error("KRA not found");

  return kra;
};

// ─── Create KRA ────────────────────────────────────────────
export const createKRA = async (data) => {
  const existing = await KRA.findOne({
    name: data.name,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("KRA with this name already exists");
  }

  const kra = await KRA.create(data);
  return kra;
};

// ─── Update KRA ────────────────────────────────────────────
export const updateKRA = async (id, updateData) => {
  const kra = await KRA.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  );

  if (!kra) throw new Error("KRA not found");

  return kra;
};

// ─── Soft Delete KRA ───────────────────────────────────────
export const deleteKRA = async (id, userId) => {
  const kra = await KRA.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!kra) throw new Error("KRA not found");

  return kra;
};
