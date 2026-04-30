import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createComp,
  deleteComp,
  getAllComp,
  getAllCompForDrops,
  getCompById,
  updateComp,
} from "../controllers/company.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_companies"), getAllComp);
router.get("/list-drop", hasPermission("manage_companies"), getAllCompForDrops);
router.get("/:id", hasPermission("manage_companies"), getCompById);
router.post("/", hasPermission("manage_companies"), createComp);
router.put("/:id", hasPermission("manage_companies"), updateComp);
router.delete("/:id", hasPermission("manage_companies"), deleteComp);

export default router;
