import { asyncHandler } from "../utils/asyncHandler.js";
import * as socketService from "../services/socket.service.js";
import * as conversationUtils from "../services/conversation.utils.js";
import MyGoal from "../models/MyGoals.js";

// ─────────────────────────────────────────────
// 🔹 Get or Create Conversation for Goal Item
// ─────────────────────────────────────────────
export const getGoalConversation = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { goalId, myGoalId } = req.query;

    // Find the goal item to get manager
    const myGoal = await MyGoal.findById(myGoalId);
    if (!myGoal) throw new Error("Goal sheet not found");

    const goalItem = myGoal.goals.id(goalId);
    if (!goalItem) throw new Error("Goal item not found");

    // Get or create conversation - also ensures conversation is linked to goal item
    const conversation = await conversationUtils.getOrCreateGoalConversation(
      myGoalId,
      goalId,
      userId,
      myGoal.manager,
    );

    res.status(200).json({
      success: true,
      data: conversation,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Send Message in Goal Conversation
// ─────────────────────────────────────────────
export const sendGoalMessage = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId, text } = req.body;

    const message = await socketService.sendMessage(
      userId,
      conversationId,
      text,
    );

    res.status(200).json({
      success: true,
      data: message,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Get Messages in Conversation
// ─────────────────────────────────────────────
export const getGoalMessages = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { conversationId } = req.params;

    // Mark messages as read
    await socketService.markMessagesRead(userId, conversationId);

    // Get messages
    const messages = await socketService.getMessages(conversationId);

    res.status(200).json({
      success: true,
      data: messages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Get Notifications
// ─────────────────────────────────────────────
export const getNotifications = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const Notification = (await import("../models/Notification.js")).default;

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Mark Notification as Read
// ─────────────────────────────────────────────
export const markNotificationRead = asyncHandler(async (req, res) => {
  try {
    const { notificationId } = req.params;
    const Notification = (await import("../models/Notification.js")).default;

    await Notification.findByIdAndUpdate(notificationId, { isRead: true });

    res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// ─────────────────────────────────────────────
// 🔹 Ensure All Goal Items Have Conversations (Utility Endpoint)
// ─────────────────────────────────────────────
export const ensureAllConversations = asyncHandler(async (req, res) => {
  try {
    const { myGoalId } = req.query;

    const myGoal = await MyGoal.findById(myGoalId);
    if (!myGoal) throw new Error("Goal sheet not found");

    await conversationUtils.ensureGoalConversations(myGoal);

    res.status(200).json({
      success: true,
      message: "All goal items have conversations linked",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});
