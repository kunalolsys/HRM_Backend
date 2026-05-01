import QuarterlyGoal from "../models/QuarterlyGoal.js";
import MyGoal from "../models/MyGoals.js";

// ─────────────────────────────────────────────
// 🔹 Create Quarterly Goals from Approved MyGoal
// ─────────────────────────────────────────────
export const createQuarterlyGoals = async (myGoal, targetQuarter = null) => {
  const quarters = targetQuarter ? [targetQuarter] : ["Q1", "Q2", "Q3", "Q4"];

  const results = [];

  for (const quarter of quarters) {
    // Check if already exists
    const existing = await QuarterlyGoal.findOne({
      user: myGoal.user,
      financialYear: myGoal.financialYear,
      quarter,
    });

    if (existing) {
      results.push({
        quarter,
        status: "ALREADY_EXISTS",
        id: existing._id,
      });
      continue;
    }

    // Create quarterly goal document with snapshot of approved goals
    const quarterlyGoal = await QuarterlyGoal.create({
      user: myGoal.user,
      manager: myGoal.manager,
      financialYear: myGoal.financialYear,
      quarter,
      myGoalRef: myGoal._id,
      goals: myGoal.goals.map((g) => ({
        sourceGoalId: g._id,
        source: g.source,
        libraryRef: g.libraryRef,
        kra: g.kra,
        kpi: g.kpi,
        category: g.category,
        uom: g.uom,
        target: g.target,
        weightage: g.weightage,
        goalType: g.goalType,
      })),
      status: "DRAFT",
    });

    results.push({
      quarter,
      status: "CREATED",
      id: quarterlyGoal._id,
    });
  }

  return results;
};

// ─────────────────────────────────────────────
// 🔹 Get Quarterly Goals (by user, year, quarter)
// ─────────────────────────────────────────────
export const getQuarterlyGoals = async (userId, financialYear, quarter) => {
  const quarterlyGoal = await QuarterlyGoal.findOne({
    user: userId,
    financialYear,
    quarter,
  })
    .populate("goals.kra goals.category goals.uom")
    .lean();

  if (!quarterlyGoal) {
    throw new Error("Quarterly goals not found");
  }

  return quarterlyGoal;
};

// ─────────────────────────────────────────────
// 🔹 Get All Quarterly Goals for User
// ─────────────────────────────────────────────
export const getAllQuarterlyGoals = async (userId, financialYear) => {
  const quarterlyGoals = await QuarterlyGoal.find({
    user: userId,
    financialYear,
  })
    .populate("goals.kra goals.category goals.uom")
    .lean();

  return quarterlyGoals;
};

// Quarter order for propagation logic
const QUARTER_ORDER = ["Q1", "Q2", "Q3", "Q4"];

// ─────────────────────────────────────────────
// 🔹 Update Quarterly Goal (target, weightage, uom)
// ─────────────────────────────────────────────
export const updateQuarterlyGoal = async (
  userId,
  financialYear,
  quarter,
  goalId,
  updateData
) => {
  // Find current quarter's goals
  const quarterlyGoal = await QuarterlyGoal.findOne({
    user: userId,
    financialYear,
    quarter,
  });

  if (!quarterlyGoal) {
    throw new Error("Quarterly goals not found");
  }

  const goal = quarterlyGoal.goals.id(goalId);
  if (!goal) {
    throw new Error("Goal not found");
  }

  // Store sourceGoalId to find matching goals in future quarters
  const sourceGoalId = goal.sourceGoalId;

  // Update fields for current quarter
  if (updateData.target !== undefined) {
    goal.target = updateData.target;
  }
  if (updateData.weightage !== undefined) {
    goal.weightage = updateData.weightage;
  }
  if (updateData.uom) {
    goal.uom = updateData.uom;
  }

  await quarterlyGoal.save();

  // ─────────────────────────────────────────────
  // 🔄 Propagate updates to future quarters
  // ─────────────────────────────────────────────
  const currentQuarterIndex = QUARTER_ORDER.indexOf(quarter);
  
  // If this is not the last quarter, propagate to future quarters
  if (currentQuarterIndex < QUARTER_ORDER.length - 1) {
    // Get future quarters
    const futureQuarters = QUARTER_ORDER.slice(currentQuarterIndex + 1);
    
    // Find and update all future quarters with the same sourceGoalId
    const futureQuarterlyGoals = await QuarterlyGoal.find({
      user: userId,
      financialYear,
      quarter: { $in: futureQuarters },
    });

    for (const futureQg of futureQuarterlyGoals) {
      // Find the matching goal by sourceGoalId
      const matchingGoal = futureQg.goals.find(
        (g) => g.sourceGoalId && g.sourceGoalId.toString() === sourceGoalId.toString()
      );

      if (matchingGoal) {
        // Update fields for future quarter
        if (updateData.target !== undefined) {
          matchingGoal.target = updateData.target;
        }
        if (updateData.weightage !== undefined) {
          matchingGoal.weightage = updateData.weightage;
        }
        if (updateData.uom) {
          matchingGoal.uom = updateData.uom;
        }

        await futureQg.save();
      }
    }
  }

  return quarterlyGoal;
};

// ─────────────────────────────────────────────
// 🔹 Add Comment to Quarterly Goal
// ─────────────────────────────────────────────
export const addCommentToQuarterlyGoal = async (
  userId,
  financialYear,
  quarter,
  goalId,
  text
) => {
  const quarterlyGoal = await QuarterlyGoal.findOne({
    user: userId,
    financialYear,
    quarter,
  });

  if (!quarterlyGoal) {
    throw new Error("Quarterly goals not found");
  }

  const goal = quarterlyGoal.goals.id(goalId);
  if (!goal) {
    throw new Error("Goal not found");
  }

  goal.comments.push({
    user: userId,
    text,
  });

  await quarterlyGoal.save();

  return quarterlyGoal;
};

// ─────────────────────────────────────────────
// 🔹 Delete Quarterly Goal Item
// ─────────────────────────────────────────────
export const deleteQuarterlyGoal = async (
  userId,
  financialYear,
  quarter,
  goalId
) => {
  const quarterlyGoal = await QuarterlyGoal.findOne({
    user: userId,
    financialYear,
    quarter,
  });

  if (!quarterlyGoal) {
    throw new Error("Quarterly goals not found");
  }

  quarterlyGoal.goals = quarterlyGoal.goals.filter(
    (g) => g._id.toString() !== goalId
  );

  await quarterlyGoal.save();

  return quarterlyGoal;
};

// ─────────────────────────────────────────────
// 🔹 Manager: Get Team Quarterly Goals
// ─────────────────────────────────────────────
export const getTeamQuarterlyGoals = async (
  managerId,
  financialYear,
  quarter,
  search = null
) => {
  const filter = {
    manager: managerId,
    financialYear,
    quarter,
  };

  // If search exists, find matching users
  if (search) {
    const User = (await import("../models/User.js")).default;
    const users = await User.find({
      fullName: { $regex: search, $options: "i" },
    }).select("_id");

    if (!users.length) {
      return [];
    }

    filter.user = { $in: users.map((u) => u._id) };
  }

  const quarterlyGoals = await QuarterlyGoal.find(filter)
    .populate("goals.kra goals.category goals.uom")
    .populate("user", "fullName")
    .populate("manager", "fullName")
    .lean();

  return quarterlyGoals;
};

// ─────────────────────────────────────────────
// 🔹 Manager: Approve Quarterly Goals
// ─────────────────────────────────────────────
export const approveQuarterlyGoals = async (managerId, quarterlyGoalId) => {
  const quarterlyGoal = await QuarterlyGoal.findById(quarterlyGoalId);

  if (!quarterlyGoal) {
    throw new Error("Quarterly goals not found");
  }

  // Security check
  if (quarterlyGoal.manager?.toString() !== managerId.toString()) {
    throw new Error("Unauthorized");
  }

  if (quarterlyGoal.status === "APPROVED") {
    throw new Error("Already approved");
  }

  quarterlyGoal.status = "APPROVED";
  quarterlyGoal.approvedAt = new Date();

  await quarterlyGoal.save();

  return quarterlyGoal;
};

// ─────────────────────────────────────────────
// 🔹 Manager: Add Remark to Quarterly Goal
// ─────────────────────────────────────────────
export const addRemarkToQuarterlyGoal = async (
  managerId,
  quarterlyGoalId,
  goalId,
  text
) => {
  const quarterlyGoal = await QuarterlyGoal.findById(quarterlyGoalId);

  if (!quarterlyGoal) {
    throw new Error("Quarterly goals not found");
  }

  const goal = quarterlyGoal.goals.id(goalId);
  if (!goal) {
    throw new Error("Goal not found");
  }

  goal.comments.push({
    user: managerId,
    text,
  });

  await quarterlyGoal.save();

  return quarterlyGoal;
};

// ─────────────────────────────────────────────
// 🔹 Admin: Update Quarterly Goal for Any User
// ─────────────────────────────────────────────
export const adminUpdateQuarterlyGoal = async (
  quarterlyGoalId,
  goalId,
  adminId,
  updateData
) => {
  const quarterlyGoal = await QuarterlyGoal.findById(quarterlyGoalId);

  if (!quarterlyGoal) {
    throw new Error("Quarterly goals not found");
  }

  const goal = quarterlyGoal.goals.id(goalId);
  if (!goal) {
    throw new Error("Goal not found");
  }

  // Update allowed fields
  if (updateData.target !== undefined) {
    goal.target = updateData.target;
  }
  if (updateData.weightage !== undefined) {
    goal.weightage = updateData.weightage;
  }
  if (updateData.uom) {
    goal.uom = updateData.uom;
  }

  // Mark as admin modified
  goal.adminModified = true;
  goal.modifiedAt = new Date();
  goal.modifiedBy = adminId;

  await quarterlyGoal.save();

  return quarterlyGoal;
};

// ─────────────────────────────────────────────
// 🔹 Bulk Create Quarterly Goals for Cron
// ─────────────────────────────────────────────
export const bulkCreateQuarterlyGoals = async (financialYear, targetQuarter) => {
  // Get all APPROVED MyGoals for this financial year
  const approvedMyGoals = await MyGoal.find({
    financialYear,
    status: "APPROVED",
  }).lean();

  const results = [];

  for (const myGoal of approvedMyGoals) {
    try {
      // Check if quarterly goal already exists
      const existing = await QuarterlyGoal.findOne({
        user: myGoal.user,
        financialYear,
        quarter: targetQuarter,
      });

      if (existing) {
        results.push({
          userId: myGoal.user,
          status: "ALREADY_EXISTS",
        });
        continue;
      }

      // Create quarterly goal
      await QuarterlyGoal.create({
        user: myGoal.user,
        manager: myGoal.manager,
        financialYear: myGoal.financialYear,
        quarter: targetQuarter,
        myGoalRef: myGoal._id,
        goals: myGoal.goals.map((g) => ({
          sourceGoalId: g._id,
          source: g.source,
          libraryRef: g.libraryRef,
          kra: g.kra,
          kpi: g.kpi,
          category: g.category,
          uom: g.uom,
          target: g.target,
          weightage: g.weightage,
          goalType: g.goalType,
        })),
        status: "DRAFT",
      });

      results.push({
        userId: myGoal.user,
        status: "CREATED",
      });
    } catch (error) {
      results.push({
        userId: myGoal.user,
        status: "ERROR",
        error: error.message,
      });
    }
  }

  return results;
};
