import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createUOM,
  deleteUOM,
  getAllUOM,
  getUOMById,
  updateUOM,
} from "../controllers/uom.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_uom"), getAllUOM);
router.get("/:id", hasPermission("manage_uom"), getUOMById);
router.post("/", hasPermission("manage_uom"), createUOM);
router.put("/:id", hasPermission("manage_uom"), updateUOM);
router.delete("/:id", hasPermission("manage_uom"), deleteUOM);

export default router;
