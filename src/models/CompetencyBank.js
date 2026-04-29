import mongoose from "mongoose";

const competencySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["Core", "Leadership", "Functional"],
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    applicabilityType: {
      type: String,
      enum: ["ALL", "DEPARTMENT", "CADRE"],
      required: true,
    },

    departments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Department",
      },
    ],

    cadres: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cadre",
      },
    ],

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

// ─── UNIQUE TITLE (ONLY NON-DELETED) ───────
competencySchema.index(
  { title: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

export default mongoose.model("Competency", competencySchema);
