import Cadre from "../models/Cadre.js";

// ─── Get All Cadre ─────────────────────────────────────────
export const getAllCadre = async (body) => {
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
      { cadreName: { $regex: body.search, $options: "i" } },
      { description: { $regex: body.search, $options: "i" } },
    ];
  }
  if (body.status) {
    filter.status = body.status;
  }

  const [data, total] = await Promise.all([
    Cadre.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Cadre.countDocuments(filter),
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

// ─── Get Cadre By ID ─────────────────────────────────────────
export const getCadreById = async (id) => {
  const cadre = await Cadre.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!cadre) throw new Error("Cadre not found");

  return cadre;
};

// ─── Create Cadre ────────────────────────────────────────────
export const createCadre = async (data) => {
  const existing = await Cadre.findOne({
    cadreName: data.cadreName,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Cadre with this name already exists");
  }

  const cadre = await Cadre.create(data);
  return cadre;
};

// ─── Update Cadre ────────────────────────────────────────────
export const updateCadre = async (id, updateData) => {
  const cadre = await Cadre.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    { returnDocument: "after", runValidators: true },
  );

  if (!cadre) throw new Error("Cadre not found");

  return cadre;
};

// ─── Soft Delete Cadre ───────────────────────────────────────
export const deleteCadre = async (id, userId) => {
  const cadre = await Cadre.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!cadre) throw new Error("Cadre not found");

  return cadre;
};
