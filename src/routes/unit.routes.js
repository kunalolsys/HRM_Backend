import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createUnit,
  deleteUnit,
  getUnit,
  getUnitById,
  updateUnit,
} from "../controllers/unit.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_units"), getUnit);
router.get("/:id", hasPermission("manage_units"), getUnitById);
router.post("/", hasPermission("manage_units"), createUnit);
router.put("/:id", hasPermission("manage_units"), updateUnit);
router.delete("/:id", hasPermission("manage_units"), deleteUnit);

export default router;
