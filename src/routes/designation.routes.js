import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createDesignation,
  deleteDesignation,
  getAllDesignation,
  getAllDesignationForDrops,
  getDesignationById,
  updateDesignation,
} from "../controllers/designation.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_designations"), getAllDesignation);
router.get("/list-drop", hasPermission("manage_designations"), getAllDesignationForDrops);
router.get("/:id", hasPermission("manage_designations"), getDesignationById);
router.post("/", hasPermission("manage_designations"), createDesignation);
router.put("/:id", hasPermission("manage_designations"), updateDesignation);
router.delete("/:id", hasPermission("manage_designations"), deleteDesignation);

export default router;
