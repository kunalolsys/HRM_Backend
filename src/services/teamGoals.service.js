import MyGoal from "../models/MyGoals.js";

export const getTeamGoals = async (userId, financialYear, body) => {
  const filter = {
    manager: userId,
    financialYear,
  };
  // 🔹 Step 1: If search exists → find matching users
  if (body.search) {
    const users = await User.find({
      fullName: { $regex: body.search, $options: "i" },
    }).select("_id");

    // if no users match → return empty
    if (!users.length) return [];

    filter.user = { $in: users.map((u) => u._id) };
  }

  const data = await MyGoal.findOne(filter)
    .populate("goals.kra goals.category goals.uom")
    .populate("user", "fullName")
    .populate("manager", "fullName")
    .lean();

  if (!data) throw new Error("No goals found");

  return data;
};
export const managerAddRemark = async (managerId, body) => {
  const { myGoalId, goalItemId, text } = body;
  const doc = await MyGoal.findOne({
    _id: myGoalId,
    manager: managerId,
  });

  if (!doc) throw new Error("Goal sheet not found");

  const goal = doc.goals.id(goalItemId);
  if (!goal) throw new Error("Goal item not found");

  goal.comments.push({
    user: managerId,
    text,
  });

  await doc.save();

  return doc;
};
//** Send Back for Correction (UNDER_EDIT) */
export const sendBackForEdit = async (managerId, myGoalId) => {
  const doc = await MyGoal.findOne({
    _id: myGoalId,
    manager: managerId,
  });

  if (!doc) throw new Error("Goal sheet not found");

  if (doc.status !== "SUBMITTED") {
    throw new Error("Only submitted goals can be reviewed");
  }

  doc.status = "UNDER_EDIT";
  doc.isLocked = false; // 🔓 unlock for user

  await doc.save();

  return doc;
};

//**Approve Goals (FINAL LOCK) */
export const approveGoals = async (managerId, myGoalId) => {
  const doc = await MyGoal.findOne({
    _id: myGoalId,
    manager: managerId,
  });

  if (!doc) throw new Error("Goal sheet not found");

  if (doc.status !== "SUBMITTED") {
    throw new Error("Only submitted goals can be approved");
  }

  doc.status = "APPROVED";
  doc.isLocked = true;
  doc.approvedAt = new Date();

  await doc.save();

  return doc;
};

//**Bulk Comment + Send Back (REAL WORLD USE) */
export const reviewAndSendBack = async (
  managerId,
  myGoalId,
  remarks, // [{goalId, text}]
) => {
  const doc = await MyGoal.findOne({
    _id: myGoalId,
    manager: managerId,
  });

  if (!doc) throw new Error("Goal sheet not found");

  for (const r of remarks) {
    const goal = doc.goals.id(r.goalId);
    if (goal) {
      goal.comments.push({
        user: managerId,
        text: r.text,
      });
    }
  }

  doc.status = "UNDER_EDIT";
  doc.isLocked = false;

  await doc.save();

  return doc;
};
