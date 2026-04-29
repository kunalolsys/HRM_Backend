import { Router } from "express";
import {
  getPermissions,
  getPermission,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permission.controller.js";
import { authenticate, hasAnyRole } from "../middlewares/auth.js";

const router = Router();

router.use(authenticate);
router.use(hasAnyRole("Admin", "HR"));

router.get("/", getPermissions);
router.get("/:id", getPermission);
router.post("/", createPermission);
router.put("/:id", updatePermission);
router.delete("/:id", deletePermission);

export default router;
