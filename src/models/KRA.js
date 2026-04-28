import mongoose from "mongoose";

const kraSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoalCategory",
      default: null,
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
kraSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const KRA = mongoose.model("KRA", kraSchema);

export default KRA;
