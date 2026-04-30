import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    goalItem: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },

    myGoal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MyGoal",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    lastMessage: String,
    lastMessageAt: Date,
  },
  { timestamps: true },
);

// ✅ ONE conversation per goal item
conversationSchema.index({ goalItem: 1 }, { unique: true });

export default mongoose.model("Conversation", conversationSchema);
