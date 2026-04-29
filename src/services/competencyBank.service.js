import Competency from "../models/CompetencyBank.js";
import Department from "../models/Department.js";
import Cadre from "../models/Cadre.js";


// ─── COMMON VALIDATION ─────────────────────────
const validateApplicability = async (data) => {
  const { applicabilityType, departments, cadres } = data;

  if (applicabilityType === "ALL") {
    data.departments = [];
    data.cadres = [];
  }

  if (applicabilityType === "DEPARTMENT") {
    if (!departments || departments.length === 0) {
      throw new Error("At least one department is required");
    }

    const validDepartments = await Department.find({
      _id: { $in: departments },
      isDeleted: false,
    });

    if (validDepartments.length !== departments.length) {
      throw new Error("Invalid department(s) selected");
    }

    data.cadres = [];
  }

  if (applicabilityType === "CADRE") {
    if (!cadres || cadres.length === 0) {
      throw new Error("At least one cadre is required");
    }

    const validCadres = await Cadre.find({
      _id: { $in: cadres },
      isDeleted: false,
    });

    if (validCadres.length !== cadres.length) {
      throw new Error("Invalid cadre(s) selected");
    }

    data.departments = [];
  }
};


// ─── GET ALL (Pagination + Filters) ────────────
export const getAllCompetency = async (body) => {
  const page = Math.max(parseInt(body.page) || 1, 1);
  const limit = Math.min(parseInt(body.limit) || 10, 100);
  const skip = (page - 1) * limit;

  const sortField = body.sortBy || "createdAt";
  const sortOrder = body.order === "asc" ? 1 : -1;

  const filter = { isDeleted: false };

  // Search
  if (body.search) {
    filter.$or = [
      { title: { $regex: body.search, $options: "i" } },
      { description: { $regex: body.search, $options: "i" } },
    ];
  }

  if (body.type) filter.type = body.type;
  if (body.status) filter.status = body.status;
  if (body.applicabilityType) filter.applicabilityType = body.applicabilityType;

  const [data, total] = await Promise.all([
    Competency.find(filter)
      .populate("departments", "departmentName")
      .populate("cadres", "cadreName")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean(),

    Competency.countDocuments(filter),
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


// ─── GET BY ID ────────────────────────────────
export const getCompetencyById = async (id) => {
  const competency = await Competency.findOne({
    _id: id,
    isDeleted: false,
  })
    .populate("departments", "departmentName")
    .populate("cadres", "cadreName")
    .lean();

  if (!competency) throw new Error("Competency not found");

  return competency;
};


// ─── CREATE ───────────────────────────────────
export const createCompetency = async (data) => {
  // Duplicate check
  const existing = await Competency.findOne({
    title: data.title,
    isDeleted: false,
  });

  if (existing) {
    throw new Error("Competency with this title already exists");
  }

  await validateApplicability(data);

  const competency = await Competency.create(data);

  return competency;
};


// ─── UPDATE ───────────────────────────────────
export const updateCompetency = async (id, updateData) => {
  const existing = await Competency.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!existing) throw new Error("Competency not found");

  // Duplicate title check (if updating title)
  if (updateData.title && updateData.title !== existing.title) {
    const duplicate = await Competency.findOne({
      title: updateData.title,
      isDeleted: false,
    });

    if (duplicate) {
      throw new Error("Competency with this title already exists");
    }
  }

  await validateApplicability(updateData);

  const updated = await Competency.findByIdAndUpdate(id, updateData, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("departments", "departmentName")
    .populate("cadres", "cadreName");

  return updated;
};


// ─── DELETE (SOFT DELETE) ─────────────────────
export const deleteCompetency = async (id, userId) => {
  const competency = await Competency.findOneAndUpdate(
    { _id: id, isDeleted: false },
    {
      isDeleted: true,
      deletedBy: userId,
      deletedAt: new Date(),
    },
    { new: true }
  );

  if (!competency) throw new Error("Competency not found");

  return competency;
};