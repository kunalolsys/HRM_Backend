import express from "express";
import * as conversationController from "../controllers/conversation.controller.js";
import { authenticate, hasPermission } from "../middlewares/auth.js";

const router = express.Router();

// 🔐 All routes require auth
router.use(authenticate);

// ─────────────────────────────────────────────
// 🔹 Get or Create Conversation for Goal Item
// ─────────────────────────────────────────────
router.get(
  "/goal",
  hasPermission("manage_own_goals"),
  conversationController.getGoalConversation,
);

// ─────────────────────────────────────────────
// 🔹 Ensure All Goal Items Have Conversations
// ─────────────────────────────────────────────
router.get(
  "/ensure-all",
  hasPermission("manage_own_goals"),
  conversationController.ensureAllConversations,
);

// ─────────────────────────────────────────────
// 🔹 Send Message in Goal Conversation
// ─────────────────────────────────────────────
router.post(
  "/message",
  hasPermission("manage_own_goals"),
  conversationController.sendGoalMessage,
);

// ─────────────────────────────────────────────
// 🔹 Get Messages in Conversation
// ─────────────────────────────────────────────
router.get(
  "/:conversationId/messages",
  hasPermission("manage_own_goals"),
  conversationController.getGoalMessages,
);

// ─────────────────────────────────────────────
// 🔹 Get Notifications
// ─────────────────────────────────────────────
router.get(
  "/notifications",
  hasPermission("manage_own_goals"),
  conversationController.getNotifications,
);

// ─────────────────────────────────────────────
// 🔹 Mark Notification as Read
// ─────────────────────────────────────────────
router.put(
  "/notifications/:notificationId/read",
  hasPermission("manage_own_goals"),
  conversationController.markNotificationRead,
);

export default router;
