import mongoose from "mongoose";

const uomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    logicBehavior: {
      type: String,
      required: false,
      enum: [
        "HIGHER_BETTER",
        "LOWER_BETTER",
        "TURNAROUND_TIME",
        "FIXED_TARGET",
        "TOLERANCE_RANGE",
      ],
      default: "Higher The Better",
    },
    description: {
      type: String,
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
uomSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const UOM = mongoose.model("UOM", uomSchema);

export default UOM;
