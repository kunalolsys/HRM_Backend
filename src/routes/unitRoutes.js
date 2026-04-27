import { Router } from "express";
import { authenticate } from "../middlewares/auth.js";
import {
  createUnit,
  deleteUnit,
  getUnit,
  getUnitById,
  updateUnit,
} from "../controllers/unitController.js";

const router = Router();

router.use(authenticate);

router.get("/", getUnit);
router.get("/:id", getUnitById);
router.post("/", createUnit);
router.put("/:id", updateUnit);
router.delete("/:id", deleteUnit);

export default router;
