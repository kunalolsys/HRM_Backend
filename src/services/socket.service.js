import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";
import { getIO } from "../socket/socket.js";
import User from "../models/User.js";

export const createConversationForGoal = async (
  myGoalId,
  goalItemId,
  userId,
  managerId,
) => {
  const existing = await Conversation.findOne({ goalItem: goalItemId });

  if (existing) return existing;

  return await Conversation.create({
    goalItem: goalItemId,
    myGoal: myGoalId,
    participants: [userId, managerId],
  });
};

export const sendMessage = async (userId, conversationId, text) => {
  const convo = await Conversation.findById(conversationId);

  if (!convo) throw new Error("Conversation not found");

  const message = await Message.create({
    conversation: conversationId,
    sender: userId,
    text,
    readBy: [userId],
  });

  // 🔹 Update conversation
  convo.lastMessage = text;
  convo.lastMessageAt = new Date();
  await convo.save();

  // 🔹 Populate sender for response
  await message.populate("sender", "fullName");

  // 🔹 Emit real-time message to conversation room
  const io = getIO();
  if (io) {
    io.to(conversationId.toString()).emit("new_message", message);
  }

  // 🔹 Notify other participants via socket + save to DB
  const receivers = convo.participants.filter(
    (p) => p.toString() !== userId.toString(),
  );

  // 💾 Save notifications to DB
  await Notification.insertMany(
    receivers.map((r) => ({
      user: r,
      title: "New Goal Message",
      message: text,
      type: "GOAL_MESSAGE",
      referenceId: conversationId,
    })),
  );

  // 📡 Emit notification events
  if (io) {
    for (const receiverId of receivers) {
      const receiverSocketId = Array.from(io.sockets.sockets.keys()).find(
        (sockKey) => {
          const socket = io.sockets.sockets.get(sockKey);
          return socket?.userId === receiverId.toString();
        }
      );
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", {
          title: "New Goal Message",
          message: text,
          type: "GOAL_MESSAGE",
          referenceId: conversationId,
        });
      }
    }
  }

  return message;
};

export const getMessages = async (conversationId) => {
  return await Message.find({ conversation: conversationId })
    .populate("sender", "fullName")
    .sort({ createdAt: 1 });
};

export const markMessagesRead = async (userId, conversationId) => {
  await Message.updateMany(
    {
      conversation: conversationId,
      readBy: { $ne: userId },
    },
    {
      $push: { readBy: userId },
    },
  );
};

export const createSystemMessage = async (conversationId, text) => {
  return await Message.create({
    conversation: conversationId,
    text,
    type: "SYSTEM",
  });
};

//**Notification Helper: Goal Approved */
export const notifyGoalApproved = async (userId, myGoalId) => {
  const notification = await Notification.create({
    user: userId,
    title: "Goals Approved",
    message: "Your goals have been approved by manager",
    type: "GOAL_APPROVED",
    referenceId: myGoalId,
  });

  // 📡 Emit real-time notification
  const io = getIO();
  if (io) {
    const userSocketId = Array.from(io.sockets.sockets.keys()).find((sockKey) => {
      const socket = io.sockets.sockets.get(sockKey);
      return socket?.userId === userId.toString();
    });
    if (userSocketId) {
      io.to(userSocketId).emit("notification", notification);
    }
  }

  return notification;
};

//**Notification Helper: Goals Sent Back */
export const notifyUnderEdit = async (userId, myGoalId) => {
  const notification = await Notification.create({
    user: userId,
    title: "Goals Sent Back",
    message: "Manager requested changes in your goals",
    type: "GOAL_UNDER_EDIT",
    referenceId: myGoalId,
  });

  // 📡 Emit real-time notification
  const io = getIO();
  if (io) {
    const userSocketId = Array.from(io.sockets.sockets.keys()).find((sockKey) => {
      const socket = io.sockets.sockets.get(sockKey);
      return socket?.userId === userId.toString();
    });
    if (userSocketId) {
      io.to(userSocketId).emit("notification", notification);
    }
  }

  return notification;
};

//**Notification Helper: Goals Submitted */
export const notifyGoalSubmitted = async (managerId, myGoalId, userName) => {
  const notification = await Notification.create({
    user: managerId,
    title: "Goals Submitted",
    message: `${userName || "Your team member"} has submitted goals for review`,
    type: "GOAL_SUBMITTED",
    referenceId: myGoalId,
  });

  // 📡 Emit real-time notification
  const io = getIO();
  if (io) {
    const managerSocketId = Array.from(io.sockets.sockets.keys()).find((sockKey) => {
      const socket = io.sockets.sockets.get(sockKey);
      return socket?.userId === managerId.toString();
    });
    if (managerSocketId) {
      io.to(managerSocketId).emit("notification", notification);
    }
  }

  return notification;
};

//**Notification Helper: New Comment on Goal */
export const notifyNewComment = async (
  conversationId,
  senderName,
  text,
  participants,
) => {
  const receivers = participants.filter((p) => p.toString() !== senderId.toString());

  await Notification.insertMany(
    receivers.map((r) => ({
      user: r,
      title: "New Comment",
      message: `${senderName} commented: ${text.substring(0, 50)}${text.length > 50 ? "..." : ""}`,
      type: "GOAL_COMMENT",
      referenceId: conversationId,
    })),
  );

  // 📡 Emit real-time notification
  const io = getIO();
  if (io) {
    for (const receiverId of receivers) {
      const receiverSocketId = Array.from(io.sockets.sockets.keys()).find(
        (sockKey) => {
          const socket = io.sockets.sockets.get(sockKey);
          return socket?.userId === receiverId.toString();
        }
      );
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("notification", {
          title: "New Comment",
          message: `${senderName} commented on a goal`,
          type: "GOAL_COMMENT",
          referenceId: conversationId,
        });
      }
    }
  }
};
