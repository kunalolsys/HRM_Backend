import GlobalGoalLibrary from "../models/GoalLibrary.js";
import MyGoal from "../models/MyGoals.js";
import Timeline from "../models/Timeline.js";
import UOM from "../models/UOM.js";

// ─────────────────────────────────────────────
// 🔹 Helper: Validate Goal Setting Window
// ─────────────────────────────────────────────
const validateGoalSettingWindow = async (financialYear) => {
  const timeline = await Timeline.findOne({
    cycleName: "GOAL_SETTING",
    financialYear,
    isArchived: false,
  });

  if (!timeline) throw new Error("Goal setting timeline not found");

  const now = new Date();

  const isAllowed =
    timeline.forceActive ||
    (now >= timeline.submissionStart && now <= timeline.submissionEnd);

  if (!isAllowed) {
    throw new Error("Goal setting window is closed");
  }

  return timeline;
};

// ─────────────────────────────────────────────
// 🔹 Create / Initialize My Goals
// ─────────────────────────────────────────────
export const initMyGoals = async (userId, managerId, financialYear) => {
  const existing = await MyGoal.findOne({ user: userId, financialYear });

  if (existing) return existing;

  await validateGoalSettingWindow(financialYear);

  const data = await MyGoal.create({
    user: userId,
    manager: managerId,
    financialYear,
    goals: [],
  });

  return data;
};

// ─────────────────────────────────────────────
// 🔹 Import from Global Goal Library
// ─────────────────────────────────────────────
export const importFromLibrary = async (
  userId,
  financialYear,
  libraryIds,
  goalType, // "ROUTINE" | "SPECIAL"
) => {
  const myGoal = await MyGoal.findOne({ user: userId, financialYear });

  if (!myGoal) throw new Error("MyGoals not initialized");
  if (myGoal.isLocked) throw new Error("Goals already submitted");

  const libraries = await GlobalGoalLibrary.find({
    _id: { $in: libraryIds },
    isDeleted: false,
  }).populate("kras.kra kras.category");

  let newGoals = [];

  for (const lib of libraries) {
    for (const kraBlock of lib.kras) {
      for (const kpi of kraBlock.kpis) {
        newGoals.push({
          source: "LIBRARY",
          libraryRef: lib._id,
          kra: kraBlock.kra._id,
          kpi: kpi.name,
          category: kraBlock.category,
          uom: null, // user will select
          logic: "", // auto fill later
          target: "",
          weightage: 0,
          goalType,
        });
      }
    }
  }

  myGoal.goals.push(...newGoals);
  await myGoal.save();

  return myGoal;
};

// ─────────────────────────────────────────────
// 🔹 Cascade Manager Goals
// ─────────────────────────────────────────────
export const cascadeManagerGoals = async (
  userId,
  managerId,
  financialYear,
  selectedGoalIds,
) => {
  const myGoal = await MyGoal.findOne({ user: userId, financialYear });
  if (!myGoal) throw new Error("MyGoals not initialized");
  if (myGoal.isLocked) throw new Error("Goals already submitted");

  const managerGoals = await MyGoal.findOne({
    user: managerId,
    financialYear,
    status: "APPROVED",
  });

  if (!managerGoals) {
    throw new Error("Manager goals not approved");
  }

  const selected = managerGoals.goals.filter((g) =>
    selectedGoalIds.includes(g._id.toString()),
  );

  const cascaded = selected.map((g) => ({
    source: "CASCADE",
    libraryRef: g.libraryRef,
    kra: g.kra,
    kpi: g.kpi,
    category: g.category,
    uom: g.uom,
    logic: g.logic,
    target: "",
    weightage: 0,
    goalType: g.goalType,
  }));

  myGoal.goals.push(...cascaded);
  await myGoal.save();

  return myGoal;
};

// ─────────────────────────────────────────────
// 🔹 Update Goal (target, weightage, uom)
// ─────────────────────────────────────────────
export const updateGoal = async (userId, financialYear, goalId, updateData) => {
  const myGoal = await MyGoal.findOne({ user: userId, financialYear });

  if (!myGoal) throw new Error("MyGoals not found");
  if (myGoal.isLocked) throw new Error("Goals locked");

  const goal = myGoal.goals.id(goalId);
  if (!goal) throw new Error("Goal not found");

  // Update fields
  if (updateData.target !== undefined) goal.target = updateData.target;
  if (updateData.weightage !== undefined) goal.weightage = updateData.weightage;

  if (updateData.uom) {
    const uom = await UOM.findById(updateData.uom);
    if (!uom) throw new Error("Invalid UOM");

    goal.uom = uom._id;
    goal.logic = uom.logicBehavior; // snapshot
  }

  await myGoal.save();
  return myGoal;
};

// ─────────────────────────────────────────────
// 🔹 Delete Goal
// ─────────────────────────────────────────────
export const deleteGoal = async (userId, financialYear, goalId) => {
  const myGoal = await MyGoal.findOne({ user: userId, financialYear });

  if (!myGoal) throw new Error("MyGoals not found");
  if (myGoal.isLocked) throw new Error("Goals locked");

  myGoal.goals = myGoal.goals.filter((g) => g._id.toString() !== goalId);

  await myGoal.save();
  return myGoal;
};

// ─────────────────────────────────────────────
// 🔹 Add Comment
// ─────────────────────────────────────────────
export const addComment = async (userId, financialYear, goalId, text) => {
  const myGoal = await MyGoal.findOne({ user: userId, financialYear });

  if (!myGoal) throw new Error("MyGoals not found");

  const goal = myGoal.goals.id(goalId);
  if (!goal) throw new Error("Goal not found");

  goal.comments.push({
    user: userId,
    text,
  });

  await myGoal.save();
  return myGoal;
};

// ─────────────────────────────────────────────
// 🔹 Submit Goals (FINAL LOCK)
// ─────────────────────────────────────────────
export const submitGoals = async (userId, financialYear) => {
  const myGoal = await MyGoal.findOne({ user: userId, financialYear });

  if (!myGoal) throw new Error("MyGoals not found");
  if (myGoal.isLocked) throw new Error("Already submitted");

  const routine = myGoal.goals.filter((g) => g.goalType === "ROUTINE");
  const special = myGoal.goals.filter((g) => g.goalType === "SPECIAL");

  const sum = (arr) => arr.reduce((acc, g) => acc + (g.weightage || 0), 0);

  const routineWeight = sum(routine);
  const specialWeight = sum(special);
  const total = routineWeight + specialWeight;

  if (routine.length < 3) throw new Error("Min 3 routine KPIs required");
  if (special.length < 1) throw new Error("Min 1 special KPI required");

  if (routineWeight !== 80) throw new Error("Routine weight must be 80%");
  if (specialWeight !== 20) throw new Error("Special weight must be 20%");
  if (total !== 100) throw new Error("Total must be 100%");

  myGoal.status = "SUBMITTED";
  myGoal.isLocked = true;
  myGoal.submittedAt = new Date();

  await myGoal.save();

  return myGoal;
};

// ─────────────────────────────────────────────
// 🔹 Get My Goals
// ─────────────────────────────────────────────
export const getMyGoals = async (userId, financialYear) => {
  const data = await MyGoal.findOne({
    user: userId,
    financialYear,
  })
    .populate("goals.kra goals.category goals.uom")
    .lean();

  if (!data) throw new Error("No goals found");

  return data;
};
