import { Router } from "express";
import {
  getRoles,
  getRole,
  createRole,
  updateRole,
  deleteRole,
  assignPermissions,
} from "../controllers/role.controller.js";
import { authenticate, hasAnyRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);
router.use(hasAnyRole("Admin", "HR"));

router.get("/", getRoles);
router.get("/:id", getRole);
router.post("/", createRole);
router.put("/:id", updateRole);
router.delete("/:id", deleteRole);
router.put("/:id/permissions", assignPermissions);

export default router;
