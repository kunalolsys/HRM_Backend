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

const quarterlyGoalItemSchema = new mongoose.Schema(
  {
    // Link to original goal item
    sourceGoalId: {
      type: mongoose.Schema.Types.ObjectId,
    },

    // Source tracking
    source: {
      type: String,
      enum: ["LIBRARY", "CASCADE"],
      required: true,
    },

    libraryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GlobalGoalLibrary",
    },

    kra: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "KRA",
    },

    kpi: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GoalCategory",
    },

    uom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UOM",
    },

    // User input
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

    // Admin modification tracking
    adminModified: {
      type: Boolean,
      default: false,
    },

    modifiedAt: {
      type: Date,
      default: null,
    },

    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    comments: [commentSchema],
  },
  { _id: true },
);

const quarterlyGoalSchema = new mongoose.Schema(
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

    quarter: {
      type: String,
      enum: ["Q1", "Q2", "Q3", "Q4"],
      required: true,
    },

    // Reference to original MyGoal (for audit)
    myGoalRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MyGoal",
    },

    goals: [quarterlyGoalItemSchema],

    status: {
      type: String,
      enum: ["DRAFT", "APPROVED"],
      default: "DRAFT",
    },

    // When quarterly goals were created
    createdAt: {
      type: Date,
      default: Date.now,
    },

    // When manager approved quarterly goals
    approvedAt: Date,
  },
  { timestamps: true },
);

// Unique index: user + year + quarter
quarterlyGoalSchema.index(
  { user: 1, financialYear: 1, quarter: 1 },
  { unique: true }
);

const QuarterlyGoal = mongoose.model("QuarterlyGoal", quarterlyGoalSchema);

export default QuarterlyGoal;
