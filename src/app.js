import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import roleRoutes from "./routes/roleRoutes.js";
import permissionRoutes from "./routes/permissionRoutes.js";
import companiesRoutes from "./routes/companyRoutes.js";
import unitRoutes from "./routes/unitRoutes.js";
import depRoutes from "./routes/departmentRoutes.js";
import cadreRoutes from "./routes/cadreRoutes.js";
import gradeRoutes from "./routes/gradeRoute.js";
import designationRoutes from "./routes/designationRoutes.js";
import timelineRoutes from "./routes/timelineRoutes.js";
import uomRoutes from "./routes/uomRoutes.js";
import goalCatRoutes from "./routes/goalCatRoutes.js";
import kraRoutes from "./routes/kraRoutes.js";
import goalLibRoutes from "./routes/goalLibRoutes.js";
import trainingRoutes from "./routes/trainingRoutes.js";

const app = express();

// --- GLOBAL MIDDLEWARES ---

// CORS configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging (development)
if (process.env.NODE_ENV === "development") {
  app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} | ${req.method} ${req.path}`);
    next();
  });
}

// --- ROUTES ---

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/permissions", permissionRoutes);
//**Company & Unit Master */
app.use("/api/companies", companiesRoutes);
app.use("/api/units", unitRoutes);

//**Department Master */
app.use("/api/department", depRoutes);

//**Cadre Master */
app.use("/api/cadres", cadreRoutes);

//**Grade Master */
app.use("/api/grades", gradeRoutes);

//**Designation Master */
app.use("/api/designations", designationRoutes);

//**Timeline Master */
app.use("/api/timeline", timelineRoutes);

//**UOM Master */
app.use("/api/uom", uomRoutes);

//**Goal Category Master */
app.use("/api/goalCat", goalCatRoutes);

//**KRA Master */
app.use("/api/kra", kraRoutes);

//**Goal Lib Master */
app.use("/api/goal-library", goalLibRoutes);

//**Training Master */
app.use("/api/training", trainingRoutes);

// --- GLOBAL ERROR HANDLER ---
app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
