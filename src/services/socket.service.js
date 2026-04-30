import Conversation from "../models/Conversation.js";
import Message from "../models/Message.js";
import Notification from "../models/Notification.js";

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

  // 🔹 Notify other participants
  const receivers = convo.participants.filter(
    (p) => p.toString() !== userId.toString(),
  );

  await Notification.insertMany(
    receivers.map((r) => ({
      user: r,
      title: "New Goal Message",
      message: text,
      type: "GOAL_MESSAGE",
      referenceId: conversationId,
    })),
  );

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
//**Notification Helper */
export const notifyGoalApproved = async (userId, myGoalId) => {
  await Notification.create({
    user: userId,
    title: "Goals Approved",
    message: "Your goals have been approved by manager",
    type: "GOAL_APPROVED",
    referenceId: myGoalId,
  });
};

export const notifyUnderEdit = async (userId, myGoalId) => {
  await Notification.create({
    user: userId,
    title: "Goals Sent Back",
    message: "Manager requested changes in your goals",
    type: "GOAL_UNDER_EDIT",
    referenceId: myGoalId,
  });
};
