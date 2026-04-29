import Timeline from "../models/Timeline.js";

export const getAllTimeline = async () => {
  return await Timeline.find().lean();
};
export const updatePmsTimeline = async (id, data) => {
  const allowedFields = [
    "submissionStart",
    "submissionEnd",
    "graceEnd",
    "forceActive",
  ];

  // ─── Filter only allowed fields ─────────────
  const updateData = {};
  for (const key of allowedFields) {
    if (data[key] !== undefined) {
      updateData[key] = data[key];
    }
  }

  // ─── Validate dates ─────────────────────────
  if (
    updateData.submissionStart &&
    updateData.submissionEnd &&
    new Date(updateData.submissionStart) > new Date(updateData.submissionEnd)
  ) {
    throw new Error("Submission start cannot be after submission end");
  }

  if (
    updateData.submissionEnd &&
    updateData.graceEnd &&
    new Date(updateData.submissionEnd) > new Date(updateData.graceEnd)
  ) {
    throw new Error("Grace period must be after submission end");
  }

  // ─── Update ─────────────────────────────────
  const updated = await Timeline.findOneAndUpdate({ _id: id }, updateData, {
    returnDocument: "after",
    runValidators: true,
  });

  if (!updated) {
    throw new Error("Timeline not found");
  }

  return updated;
};
