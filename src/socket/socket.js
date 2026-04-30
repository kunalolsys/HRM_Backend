import { Server } from "socket.io";

let io;
const onlineUsers = new Map(); // userId → socketId

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

    // 🔐 Register user
    socket.on("register", (userId) => {
      onlineUsers.set(userId.toString(), socket.id);
      console.log("User registered:", userId);
    });

    // 💬 Join conversation room
    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
    });

    // 🚪 Leave room
    socket.on("leave_conversation", (conversationId) => {
      socket.leave(conversationId);
    });

    // ❌ Disconnect
    socket.on("disconnect", () => {
      console.log("🔴 Disconnected:", socket.id);

      for (let [userId, sockId] of onlineUsers.entries()) {
        if (sockId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  return io;
};

export const getIO = () => io;

export const getReceiverSocket = (userId) => {
  return onlineUsers.get(userId.toString());
};
