import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // userId → socketId
const socketUserMap = new Map(); // socketId → userId

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🟢 Connected:", socket.id);

    // 🔐 Register user - store mapping
    socket.on("register", (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      socketUserMap.set(socket.id, userId.toString());
      socket.userId = userId.toString(); // Attach to socket object for easy access
      console.log("User registered:", userId, "socket:", socket.id);
    });

    // 💬 Join conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId.toString());
      console.log("Socket joined conversation:", conversationId);
    });

    // 💬 Leave room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId.toString());
    });

    // 👋 Send typing indicator
    socket.on("typing", (data) => {
      const { conversationId, senderName } = data;
      socket.to(conversationId.toString()).emit("typing", {
        senderName,
        conversationId,
      });
    });

    // ❌ Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);
      const userId = socketUserMap.get(socket.id);
      if (userId) {
        onlineUsers.delete(userId);
        socketUserMap.delete(socket.id);
      }
    });
  });

  return io;
};

export const getIO = () => io;

export const getReceiverSocket = (userId) => {
  return onlineUsers.get(userId.toString());
};

// Helper to broadcast to specific user
export const emitToUser = (userId, event, data) => {
  if (io) {
    const socketId = onlineUsers.get(userId.toString());
    if (socketId) {
      io.to(socketId).emit(event, data);
    }
  }
};

// Helper to broadcast to conversation room
export const emitToConversation = (conversationId, event, data) => {
  if (io) {
    io.to(conversationId.toString()).emit(event, data);
  }
};
