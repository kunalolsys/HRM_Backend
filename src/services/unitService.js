import Company from "../models/Company.js";
import Unit from "../models/Unit.js";

// ─── Get All Units ─────────────────────────────────────────
export const getAllUnits = async (body) => {
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
      { unitName: { $regex: body.search, $options: "i" } },
      { locationCode: { $regex: body.search, $options: "i" } },
    ];
  }
  if (body.company) {
    filter.company = body.company;
  }
  const [data, total] = await Promise.all([
    Unit.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Unit.countDocuments(filter),
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

// ─── Get Unit By ID ─────────────────────────────────────────
export const getUnitById = async (id) => {
  const unit = await Unit.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!unit) throw new Error("Unit not found");

  return unit;
};

// ─── Create Unit ────────────────────────────────────────────
export const createUnit = async (data) => {
  // ─── Validate Company ─────────────────────────────
  const company = await Company.findOne({
    _id: data.company,
    isDeleted: false,
  });

  if (!company) {
    throw new Error("Invalid company selected");
  }

  // ─── Check duplicate (within same company) ────────
  const existing = await Unit.findOne({
    unitName: data.unitName,
    company: data.company,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Unit with this name already exists in this company");
  }

  // ─── Create Unit ─────────────────────────────────
  const unit = await Unit.create({
    unitName: data.unitName,
    locationCode: data.locationCode,
    company: data.company,
  });

  return unit;
};

// ─── Update Unit ────────────────────────────────────────────
export const updateUnit = async (id, updateData) => {
  // ─── Check existing unit ─────────────────────────
  const existingUnit = await Unit.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!existingUnit) {
    throw new Error("Unit not found");
  }

  // ─── Validate company if updating ────────────────
  if (updateData.company) {
    const company = await Company.findOne({
      _id: updateData.company,
      isDeleted: false,
    });

    if (!company) {
      throw new Error("Invalid company");
    }
  }

  // ─── Duplicate check ─────────────────────────────
  if (updateData.unitName || updateData.company) {
    const duplicate = await Unit.findOne({
      unitName: updateData.unitName || existingUnit.unitName,
      company: updateData.company || existingUnit.company,
      isDeleted: false,
      _id: { $ne: id }, // exclude current
    });

    if (duplicate) {
      throw new Error("Unit with this name already exists in this company");
    }
  }

  // ─── Update ──────────────────────────────────────
  const updatedUnit = await Unit.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  }).populate("company", "entityName acronym");

  return updatedUnit;
};

// ─── Soft Delete Unit ───────────────────────────────────────
export const deleteUnit = async (id, userId) => {
  const unit = await Unit.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!unit) throw new Error("Unit not found");

  return unit;
};
