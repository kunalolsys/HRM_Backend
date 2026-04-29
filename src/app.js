import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import roleRoutes from "./routes/role.routes.js";
import permissionRoutes from "./routes/permission.routes.js";
import companiesRoutes from "./routes/company.routes.js";
import unitRoutes from "./routes/unit.routes.js";
import depRoutes from "./routes/department.routes.js";
import cadreRoutes from "./routes/cadre.routes.js";
import gradeRoutes from "./routes/grade.route.js";
import designationRoutes from "./routes/designation.routes.js";
import timelineRoutes from "./routes/timeline.routes.js";
import uomRoutes from "./routes/uom.routes.js";
import goalCatRoutes from "./routes/goalCat.routes.js";
import kraRoutes from "./routes/kra.routes.js";
import goalLibRoutes from "./routes/goalLib.routes.js";
import trainingRoutes from "./routes/training.routes.js";
import competencyBankRoutes from "./routes/competencyBank.routes.js";
import myGoalsRoutes from "./routes/myGoals.routes.js";

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

//**Competency Bank Master */
app.use("/api/competency", competencyBankRoutes);

//**My Goals */
app.use("/api/myGoals", myGoalsRoutes);

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
