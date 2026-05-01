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
// export const sendBackForEdit = async (managerId, myGoalId) => {
//   const doc = await MyGoal.findOne({
//     _id: myGoalId,
//     manager: managerId,
//   });

//   if (!doc) throw new Error("Goal sheet not found");

//   if (doc.status !== "SUBMITTED") {
//     throw new Error("Only submitted goals can be reviewed");
//   }

//   doc.status = "UNDER_EDIT";
//   doc.isLocked = false; // 🔓 unlock for user

//   await doc.save();

//   return doc;
// };
export const reviewMyGoal = async (
  managerId,
  myGoalId,
  action, // "APPROVE" | "REJECT"
  remarks // [{ goalId, text }]
) => {
  const myGoal = await MyGoal.findById(myGoalId);

  if (!myGoal) throw new Error("MyGoal not found");

  // ✅ Security check
  if (myGoal.manager.toString() !== managerId.toString()) {
    throw new Error("Unauthorized");
  }

  if (myGoal.status !== "SUBMITTED") {
    throw new Error("Only submitted goals can be reviewed");
  }

  // ─────────────────────────────
  // ✅ CASE 1: APPROVE
  // ─────────────────────────────
  if (action === "APPROVE") {
    myGoal.status = "APPROVED";
    myGoal.isLocked = true;
    myGoal.approvedAt = new Date();

    await myGoal.save();
    return myGoal;
  }

  // ─────────────────────────────
  // ✅ CASE 2: SEND BACK (UNDER_EDIT)
  // ─────────────────────────────
  if (action === "REJECT") {
    // ❌ BLOCK second time
    if (myGoal.revisionCount >= 1) {
      throw new Error("Re-edit already used once. Cannot send again.");
    }

    // ✅ Add remarks to specific goals
    if (remarks && remarks.length) {
      for (const r of remarks) {
        const goal = myGoal.goals.id(r.goalId);
        if (!goal) continue;

        goal.comments.push({
          user: managerId,
          text: r.text,
        });
      }
    }

    myGoal.status = "UNDER_EDIT";
    myGoal.isLocked = false; // 🔥 unlock for user
    myGoal.revisionCount += 1;

    await myGoal.save();
    return myGoal;
  }

  throw new Error("Invalid action");
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
