import mongoose from "mongoose";
import dotenv from "dotenv";
import Permission from "../models/Permission.js";
import Role from "../models/Role.js";
import User from "../models/User.js";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://localhost:27017/pms";

const permissionsData = [
  { name: "manage_companies", description: "Manage companies", module: "Admin" },
  { name: "manage_units", description: "Manage units", module: "Admin" },
  { name: "manage_departments", description: "Manage departments", module: "Admin" },
  { name: "manage_cadres", description: "Manage cadres", module: "Admin" },
  { name: "manage_grades", description: "Manage grades", module: "Admin" },
  { name: "manage_designations", description: "Manage designations", module: "Admin" },
  { name: "manage_users", description: "Manage users", module: "Admin" },
  { name: "manage_timelines", description: "Manage timelines", module: "Admin" },
  { name: "manage_uom", description: "Manage UOM", module: "Admin" },
  { name: "manage_goal_library", description: "Manage goal library", module: "Admin" },
  { name: "manage_training_master", description: "Manage training catalog", module: "Admin" },
  { name: "manage_competency_bank", description: "Manage competency bank", module: "Admin" },
  { name: "manage_own_goals", description: "Set own goals", module: "Goals" },
  { name: "approve_team_goals", description: "Approve team goals", module: "Goals" },
  { name: "goal_admin_override", description: "Override any goals", module: "Goals" },
  { name: "submit_self_review", description: "Submit quarterly self-review", module: "Reviews" },
  { name: "conduct_team_reviews", description: "Conduct team reviews", module: "Reviews" },
  { name: "view_audit_tracker", description: "View audit tracker", module: "Reviews" },
  { name: "conduct_appraisal", description: "Conduct annual appraisal", module: "Appraisal" },
  { name: "view_9box_grid", description: "View 9-box talent grid", module: "Appraisal" },
  { name: "hr_assessment_console", description: "HR assessment console", module: "Appraisal" },
  { name: "view_trainings", description: "View assigned trainings", module: "T&D" },
  { name: "manage_corporate_training", description: "Manage corporate training", module: "T&D" },
  { name: "view_reports", description: "View reports", module: "Reports" },
  { name: "view_dashboard", description: "View dashboard", module: "Dashboard" },
  { name: "all_access", description: "Full system access", module: "System" },
];

const roleDefinitions = [
  { name: "Admin", description: "System administrator with full access", isDefault: false },
  { name: "HR", description: "HR process owner with oversight", isDefault: false },
  { name: "Management", description: "Top leadership and executives", isDefault: false },
  { name: "Manager", description: "Team lead with dual self + team duties", isDefault: false },
  { name: "Employee", description: "Individual contributor", isDefault: true },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing
    await Permission.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({});
    console.log("Cleared existing permissions, roles, and users");

    // Insert permissions
    const insertedPermissions = await Permission.insertMany(permissionsData);
    console.log(`Inserted ${insertedPermissions.length} permissions`);

    const permMap = {};
    insertedPermissions.forEach((p) => (permMap[p.name] = p._id));

    // Build role-permission mappings
    const rolePermissionMap = {
      Admin: Object.values(permMap),
      HR: [
        permMap.manage_users,
        permMap.manage_timelines,
        permMap.manage_goal_library,
        permMap.manage_training_master,
        permMap.manage_competency_bank,
        permMap.goal_admin_override,
        permMap.view_audit_tracker,
        permMap.hr_assessment_console,
        permMap.manage_corporate_training,
        permMap.view_reports,
        permMap.view_dashboard,
        permMap.all_access,
      ],
      Management: [
        permMap.manage_own_goals,
        permMap.approve_team_goals,
        permMap.conduct_team_reviews,
        permMap.conduct_appraisal,
        permMap.view_9box_grid,
        permMap.view_reports,
        permMap.view_dashboard,
      ],
      Manager: [
        permMap.manage_own_goals,
        permMap.approve_team_goals,
        permMap.submit_self_review,
        permMap.conduct_team_reviews,
        permMap.conduct_appraisal,
        permMap.view_trainings,
        permMap.view_dashboard,
      ],
      Employee: [
        permMap.manage_own_goals,
        permMap.submit_self_review,
        permMap.view_trainings,
        permMap.view_dashboard,
      ],
    };

    const rolesToInsert = roleDefinitions.map((role) => ({
      ...role,
      permissions: rolePermissionMap[role.name] || [],
    }));

    const insertedRoles = await Role.insertMany(rolesToInsert);
    console.log(`Inserted ${insertedRoles.length} roles`);

    insertedRoles.forEach((r) => {
      console.log(`- ${r.name}: ${r.permissions.length} permissions`);
    });

    // Create seed admin user
    const adminRole = insertedRoles.find((r) => r.name === "Admin");
    if (adminRole) {
      await User.create({
        employeeCode: "ADMIN001",
        fullName: "System Administrator",
        email: "admin@pragati.com",
        password: "admin123",
        roles: [adminRole._id],
        status: "Active",
      });
      console.log("Created seed admin user: admin@pragati.com / admin123");
    }

    console.log("\nSeeding completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error.message);
    process.exit(1);
  }
}

seed();

