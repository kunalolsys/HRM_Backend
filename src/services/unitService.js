import Company from "../models/Company.js";
import Unit from "../models/Unit.js";

// ─── Get All Units ─────────────────────────────────────────
export const getAllUnits = async () => {
  return await Unit.find({ isDeleted: false }).sort({ createdAt: -1 }).lean();
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
    new: true,
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
