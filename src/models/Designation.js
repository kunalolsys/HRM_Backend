import mongoose from "mongoose";

const designationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    grade: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grade",
      default: null,
      required: true,
    },
    cadre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cadre",
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
designationSchema.index(
  { name: 1, grade: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);
const Designation = mongoose.model("Designation", designationSchema);

export default Designation;
