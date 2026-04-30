import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    // 👁️ Read tracking
    readBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // 🧠 System / user message
    type: {
      type: String,
      enum: ["TEXT", "SYSTEM"],
      default: "TEXT",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Message", messageSchema);
