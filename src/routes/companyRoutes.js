import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  createComp,
  deleteComp,
  getAllComp,
  getCompById,
  updateComp,
} from "../controllers/companyController.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_companies"), getAllComp);
router.get("/:id", hasPermission("manage_companies"), getCompById);
router.post("/", hasPermission("manage_companies"), createComp);
router.put("/:id", hasPermission("manage_companies"), updateComp);
router.delete("/:id", hasPermission("manage_companies"), deleteComp);

export default router;
