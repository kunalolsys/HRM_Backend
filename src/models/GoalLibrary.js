import mongoose from "mongoose";

const combinationSchema = new mongoose.Schema({
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Department",
    default: null,
  },
  grade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grade",
    default: null,
  },
  designation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Designation",
    default: null,
  },
});

const kpiSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

const kraBlockSchema = new mongoose.Schema({
  kra: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "KRA",
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "GoalCategory",
    required: false,
  },
  kpis: {
    type: [kpiSchema],
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: "At least 1 KPI is required per KRA",
    },
  },
});

const globalGoalLibrarySchema = new mongoose.Schema(
  {
    // ─── SECTION A: ROLE MAPPING ─────────────
    combinations: {
      type: [combinationSchema],
      required: true,
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one role combination is required",
      },
    },

    // ─── SECTION B: CLASSIFICATION ───────────
    goalType: {
      type: String,
      enum: ["ROUTINE", "SPECIAL"],
      required: true,
    },

    goalCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoalCategory",
      required: true,
    },

    // ─── SECTION C: KRA + KPI BUILDER ───────
    kras: {
      type: [kraBlockSchema],
      required: true,
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
const GlobalGoalLibrary = mongoose.model("GlobalGoalLibrary", globalGoalLibrarySchema);

export default GlobalGoalLibrary;
