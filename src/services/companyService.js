import Company from "../models/Company.js";

// ─── Get All Companies ─────────────────────────────────────────
export const getAllCompany = async () => {
  return await Company.find({ isDeleted: false })
    .sort({ createdAt: -1 })
    .lean();
};

// ─── Get Company By ID ─────────────────────────────────────────
export const getCompanyById = async (id) => {
  const company = await Company.findOne({
    _id: id,
    isDeleted: false,
  }).lean();

  if (!company) throw new Error("Company not found");

  return company;
};

// ─── Create Company ────────────────────────────────────────────
export const createCompany = async (data) => {
  const existing = await Company.findOne({
    entityName: data.entityName,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Company with this name already exists");
  }

  const company = await Company.create(data);
  return company;
};

// ─── Update Company ────────────────────────────────────────────
export const updateCompany = async (id, updateData) => {
  const company = await Company.findOneAndUpdate(
    { _id: id, isDeleted: false },
    updateData,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!company) throw new Error("Company not found");

  return company;
};

// ─── Soft Delete Company ───────────────────────────────────────
export const deleteCompany = async (id, userId) => {
  const company = await Company.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true, deletedBy: userId, deletedAt: new Date() },
    { new: true },
  );

  if (!company) throw new Error("Company not found");

  return company;
};
