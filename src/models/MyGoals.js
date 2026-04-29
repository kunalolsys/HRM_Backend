import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text: String,
  },
  { timestamps: true },
);

const goalItemSchema = new mongoose.Schema(
  {
    // 🔗 SOURCE TRACKING
    source: {
      type: String,
      enum: ["LIBRARY", "CASCADE"],
      required: true,
    },

    libraryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GlobalGoalLibrary",
      required: true,
    },

    kra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KRA",
      required: true,
    },

    kpi: {
      type: String, // stored as text snapshot (important)
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoalCategory",
    },

    // 🔗 UOM MASTER LINK
    uom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UOM",
      required: true,
    },

    // 👤 USER INPUT
    target: {
      type: String,
      default: "",
    },

    weightage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    goalType: {
      type: String,
      enum: ["ROUTINE", "SPECIAL"],
      required: true,
    },

    comments: [commentSchema],
  },
  { _id: true },
);

const myGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    financialYear: {
      type: String,
      required: true,
    },

    // ✅ ONLY CREATED IN GOAL_SETTING
    isLocked: {
      type: Boolean,
      default: false,
    },

    goals: [goalItemSchema],

    status: {
      type: String,
      enum: ["DRAFT", "SUBMITTED", "APPROVED"],
      default: "DRAFT",
    },

    submittedAt: Date,
    approvedAt: Date,
  },
  { timestamps: true },
);

// ✅ ONE GOAL SHEET PER YEAR PER USER
myGoalSchema.index({ user: 1, financialYear: 1 }, { unique: true });

const MyGoal = mongoose.model("MyGoal", myGoalSchema);

export default MyGoal;
