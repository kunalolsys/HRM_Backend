import mongoose from "mongoose";

const timelineSchema = new mongoose.Schema(
  {
    cycleName: {
      type: String,
      enum: ["GOAL_SETTING", "Q1", "Q2", "Q3", "ANNUAL_APPRAISAL"],
      required: true,
    },

    financialYear: {
      type: String, // "2024-25"
      required: true,
    },

    assessmentStart: Date,
    assessmentEnd: Date,

    submissionStart: { type: Date, required: true },
    submissionEnd: { type: Date, required: true },

    graceEnd: Date,

    forceActive: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    // isDeleted: {
    //   type: Boolean,
    //   default: false,
    // },
    // deletedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "User",
    //   default: null,
    // },
    // deletedAt: {
    //   type: Date,
    //   default: null,
    // },
  },
  { timestamps: true },
);

timelineSchema.index({ cycleName: 1, financialYear: 1 }, { unique: true });

const Timeline = mongoose.model("Timeline", timelineSchema);

export default Timeline;
