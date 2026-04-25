import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔌 User connected:", socket.id);

    // ✅ Join personal room
    socket.on("join", (userId) => {
      socket.join(userId);
      console.log(`👤 User ${userId} joined personal room`);
    });

    // ✅ Join TASK rooms
    socket.on("join-tasks", (userId) => {
      socket.join(`user_tasks_${userId}`);
      console.log(`📋 User ${userId} joined tasks room`);
    });

    // ✅ Join conversation room
    socket.on("join-conversation", (conversationId) => {
      socket.join(conversationId);
      console.log(`💬 Joined conversation ${conversationId}`);
    });

    socket.on("disconnect", () => {
      console.log("❌ User disconnected:", socket.id);
    });
  });

  return io;
};

// ✅ Access io anywhere (controllers, services)
export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
