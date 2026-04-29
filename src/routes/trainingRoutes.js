import { Router } from "express";
import { authenticate, hasPermission } from "../middlewares/auth.js";
import {
  deleteTraining,
  createTraining,
  getAllTraining,
  getTrainingById,
  updateTraining,
} from "../controllers/training.controller.js";

const router = Router();

router.use(authenticate);

router.post("/list", hasPermission("manage_training_master"), getAllTraining);
router.get("/:id", hasPermission("manage_training_master"), getTrainingById);
router.post("/", hasPermission("manage_training_master"), createTraining);
router.put("/:id", hasPermission("manage_training_master"), updateTraining);
router.delete("/:id", hasPermission("manage_training_master"), deleteTraining);

export default router;
