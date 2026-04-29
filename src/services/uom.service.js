import UOM from "../models/UOM.js";

// ─── Get All UOM ─────────────────────────────────────────
export const getAllUOM = async (body) => {
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
    UOM.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    UOM.countDocuments(filter),
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

// ─── Get UOM By ID ─────────────────────────────────────────
export const getUOMById = async (id) => {
  const uom = await UOM.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!uom) throw new Error("UOM not found");

  return uom;
};

// ─── Create UOM ────────────────────────────────────────────
export const createUOM = async (data) => {
  const existing = await UOM.findOne({
    name: data.name,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("UOM with this name already exists");
  }

  const uom = await UOM.create(data);
  return uom;
};

// ─── Update UOM ────────────────────────────────────────────
export const updateUOM = async (id, updateData) => {
  const uom = await UOM.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  );

  if (!uom) throw new Error("UOM not found");

  return uom;
};

// ─── Soft Delete UOM ───────────────────────────────────────
export const deleteUOM = async (id, userId) => {
  const uom = await UOM.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!uom) throw new Error("UOM not found");

  return uom;
};
