import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    gradeCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cadre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cadre",
      default: null,
      required:true
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

const Grade = mongoose.model("Grade", gradeSchema);

export default Grade;
