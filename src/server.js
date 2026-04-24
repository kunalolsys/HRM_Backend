import dotenv from "dotenv";
import app from "./app.js";
import mongoose from "mongoose";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/pms";

let server;

// --- DATABASE EVENT LISTENERS (Live Monitoring) ---
mongoose.connection.on("connected", () => {
  console.log("SUCCESS", "MongoDB connection established successfully.");
});

mongoose.connection.on("error", (err) => {
  console.log("ERROR", `MongoDB Connection Error: ${err.message}`);
});

mongoose.connection.on("disconnected", () => {
  console.log("WARNING: MongoDB disconnected");
});

// --- MAIN CONNECTION ---
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    server = app.listen(PORT, () => {
      const msg = `Server is running on port ${PORT}`;
      console.log(msg);

      // Start background cron jobs after server is up
      try {
        // TODO: Import and start cron jobs
        // import("./crons/index.js").then((cronModule) => cronModule.startCrons());
      } catch (err) {
        console.error("Failed to start crons", err);
      }
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  });

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  if (server) {
    server.close(() => {
      console.log("Server closed.");
      mongoose.connection.close(false, () => {
        console.log("MongoDB connection closed.");
        process.exit(0);
      });
    });
  } else {
    process.exit(0);
  }
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

