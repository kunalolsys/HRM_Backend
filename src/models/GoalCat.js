import mongoose from "mongoose";

const goalCatSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    deletedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);
// 🔥 Unique only for non-deleted
goalCatSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const GoalCategory = mongoose.model("GoalCategory", goalCatSchema);

export default GoalCategory;
