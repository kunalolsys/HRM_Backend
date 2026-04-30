import Company from "../models/Company.js";

// ─── Get All Companies ─────────────────────────────────────────
export const getAllCompany = async (body) => {
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
      { entityName: { $regex: body.search, $options: "i" } },
      { acronym: { $regex: body.search, $options: "i" } },
    ];
  }
  const [data, total] = await Promise.all([
    Company.find(filter)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Company.countDocuments(filter),
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
  const data = await Company.find(filter)
    .select("_id entityName") // 🔥 only required fields
    .sort({ entityName: 1 })
    .lean();

  return data;
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
    { returnDocument: "after", runValidators: true },
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
