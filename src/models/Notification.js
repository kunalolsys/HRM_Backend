import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: String,
    message: String,

    type: {
      type: String,
      enum: [
        "GOAL_MESSAGE",
        "GOAL_SUBMITTED",
        "GOAL_APPROVED",
        "GOAL_UNDER_EDIT",
      ],
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId, // conversation or myGoal
    },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Notification", notificationSchema);
