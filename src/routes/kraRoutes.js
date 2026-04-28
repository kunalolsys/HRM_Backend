import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createKRA,
  deleteKRA,
  getAllKRA,
  getKRAById,
  updateKRA,
} from "../controllers/kraController.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_kra"), getAllKRA);
router.get("/:id", hasPermission("manage_kra"), getKRAById);
router.post("/", hasPermission("manage_kra"), createKRA);
router.put("/:id", hasPermission("manage_kra"), updateKRA);
router.delete("/:id", hasPermission("manage_kra"), deleteKRA);

export default router;
