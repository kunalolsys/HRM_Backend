import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  deleteDep,
  createDep,
  getAllDep,
  getDepById,
  updateDep,
} from "../controllers/department.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_departments"), getAllDep);
router.get("/:id", hasPermission("manage_departments"), getDepById);
router.post("/", hasPermission("manage_departments"), createDep);
router.put("/:id", hasPermission("manage_departments"), updateDep);
router.delete("/:id", hasPermission("manage_departments"), deleteDep);

export default router;
