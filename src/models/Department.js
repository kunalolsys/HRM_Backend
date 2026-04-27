import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema(
  {
    depCode: {
      type: String,
      required: true,
      trim: true,
    },
    departmentName: {
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

// ✅ Unique with soft delete support
departmentSchema.index(
  { depCode: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const Department = mongoose.model("Department", departmentSchema);

export default Department;
