import MyGoals from "../models/MyGoals.js";
import GlobalGoalLibrary from "../models/GoalLibrary.js";
import User from "../models/User.js";

const validateGoalWeightsAndCounts = (routineGoals, specialGoals) => {
  // Routine: sum weight == 80, 3-16 KPIs, each 5-30
  const routineTotalWeight = routineGoals.reduce(
    (sum, block) =>
      sum + block.kpis.reduce((kSum, kpi) => kSum + kpi.weight, 0),
    0,
  );
  const routineKpiCount = routineGoals.reduce(
    (sum, block) => sum + block.kpis.length,
    0,
  );
  if (routineTotalWeight !== 80)
    throw new Error("Routine goals must sum exactly 80% weight");
  if (routineKpiCount < 3 || routineKpiCount > 16)
    throw new Error("Routine: 3-16 KPIs required");
  routineGoals.forEach((block) => {
    block.kpis.forEach((kpi) => {
      if (kpi.weight < 5 || kpi.weight > 30)
        throw new Error("Routine KPI weight 5-30%");
    });
  });

  // Special: sum ==20, 1-4 KPIs, 5-20 each
  const specialTotalWeight = specialGoals.reduce(
    (sum, block) =>
      sum + block.kpis.reduce((kSum, kpi) => kSum + kpi.weight, 0),
    0,
  );
  const specialKpiCount = specialGoals.reduce(
    (sum, block) => sum + block.kpis.length,
    0,
  );
  if (specialTotalWeight !== 20)
    throw new Error("Special goals must sum exactly 20% weight");
  if (specialKpiCount < 1 || specialKpiCount > 4)
    throw new Error("Special: 1-4 KPIs required");
  specialGoals.forEach((block) => {
    block.kpis.forEach((kpi) => {
      if (kpi.weight < 5 || kpi.weight > 20)
        throw new Error("Special KPI weight 5-20%");
    });
  });

  if (routineTotalWeight + specialTotalWeight !== 100)
    throw new Error("Total weight must be 100%");
};

export const createMyGoals = async (data, userId, timelineId) => {
  const existing = await MyGoals.findOne({ owner: userId, timelineId });
  if (existing && existing.status !== "draft")
    throw new Error("Goals already submitted for this cycle");

  validateGoalWeightsAndCounts(
    data.routineGoals || [],
    data.specialGoals || [],
  );

  const goalsData = {
    ...data,
    owner: userId,
    timelineId,
    reportingManager:
      data.reportingManager || (await User.findById(userId)).reportingManager, // assume user has it
  };

  const doc = await MyGoals.create(goalsData);
  return await doc.populate([
    "owner",
    "reportingManager",
    "timelineId",
    "routineGoals.kraId",
    "routineGoals.goalLibraryId",
    "specialGoals.kraId",
    "specialGoals.goalLibraryId",
    { path: "routineGoals.kpis.uomId", select: "name logic" },
    { path: "specialGoals.kpis.uomId", select: "name logic" },
  ]);
};

export const getMyGoals = async (userId, timelineId) => {
  return await MyGoals.findOne({
    owner: userId,
    timelineId,
    isDeleted: false,
  }).populate([
    "owner",
    "reportingManager",
    "timelineId",
    "approvedBy",
    "routineGoals.kraId",
    "routineGoals.goalLibraryId",
    "specialGoals.kraId",
    "specialGoals.goalLibraryId",
    { path: "routineGoals.kpis.uomId", select: "name logic" },
    { path: "specialGoals.kpis.uomId", select: "name logic" },
  ]);
};

export const updateMyGoals = async (id, data, userId) => {
  const goals = await MyGoals.findOne({
    _id: id,
    owner: userId,
    isDeleted: false,
  });
  if (!goals) throw new Error("My goals not found");
  if (goals.status !== "draft")
    throw new Error("Cannot update submitted goals");

  if (data.routineGoals || data.specialGoals) {
    validateGoalWeightsAndCounts(
      data.routineGoals || goals.routineGoals,
      data.specialGoals || goals.specialGoals,
    );
  }

  const updated = await MyGoals.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate([
    "owner",
    "reportingManager",
    "timelineId",
    "routineGoals.kraId",
    "routineGoals.goalLibraryId",
    "specialGoals.kraId",
    "specialGoals.goalLibraryId",
    { path: "routineGoals.kpis.uomId" },
    { path: "specialGoals.kpis.uomId" },
  ]);
  return updated;
};

export const submitMyGoals = async (id, userId) => {
  const goals = await MyGoals.findOne({
    _id: id,
    owner: userId,
    isDeleted: false,
  });
  if (!goals) throw new Error("My goals not found");
  if (goals.status !== "draft") throw new Error("Already submitted");

  validateGoalWeightsAndCounts(goals.routineGoals, goals.specialGoals);

  // Top-down check: manager goals approved?
  const managerGoals = await MyGoals.findOne({
    owner: goals.reportingManager,
    timelineId: goals.timelineId,
    status: "approved",
  });
  if (!managerGoals) throw new Error("Manager goals must be approved first");

  goals.status = "submitted";
  goals.submittedAt = new Date();
  await goals.save();

  return await goals.populate("approvedBy");
};

export const getTeamGoals = async (
  managerId,
  timelineId,
  page = 1,
  limit = 10,
) => {
  const skip = (page - 1) * limit;
  const filter = { reportingManager: managerId, timelineId, isDeleted: false };

  const [data, total] = await Promise.all([
    MyGoals.find(filter)
      .sort({ submittedAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate([
        "owner",
        "timelineId",
        "routineGoals.kraId",
        "specialGoals.kraId",
        { path: "routineGoals.kpis.uomId" },
        { path: "specialGoals.kpis.uomId" },
      ]),
    MyGoals.countDocuments(filter),
  ]);

  return {
    data,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const approveTeamGoal = async (id, managerId) => {
  const goals = await MyGoals.findOne({
    _id: id,
    reportingManager: managerId,
    isDeleted: false,
  });
  if (!goals || goals.status !== "submitted") throw new Error("Cannot approve");

  goals.status = "approved";
  goals.approvedBy = managerId;
  goals.approvedAt = new Date();
  await goals.save();

  return goals;
};

export const deleteMyGoals = async (id, userId) => {
  const doc = await MyGoals.findOneAndUpdate(
    { _id: id, owner: userId, isDeleted: false },
    { isDeleted: true, deletedAt: new Date(), deletedBy: userId },
    { new: true },
  );
  if (!doc) throw new Error("Not found");
  return doc;
};
